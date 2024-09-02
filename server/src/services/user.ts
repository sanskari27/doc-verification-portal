import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { AccountDB, SessionDB, StorageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import { UserLevel } from '../config/const';
import { AUTH_ERRORS, CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { sendLoginCredentialsEmail } from '../provider/email';
import { IDType } from '../types';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import SessionService from './session';

type SessionDetails = {
	ipAddress?: string;
	platform?: string;
	browser?: string;
	latitude?: number;
	longitude?: number;
};

export default class UserService {
	private _user_id: IDType;
	private _level: UserLevel;
	private _account: IAccount;

	public constructor(account: IAccount) {
		this._user_id = account._id;
		this._level = account.userLevel;
		this._account = account;
	}

	static async findById(id: IDType) {
		const account = await AccountDB.findById(id);
		if (!account) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return new UserService(account);
	}

	static async login(email: string, password: string, opts: SessionDetails) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const password_matched = await user.verifyPassword(password);
		if (!password_matched) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const session = await SessionService.createSession(user._id, opts);

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: new UserService(user),
		};
	}

	static async loginById(id: Types.ObjectId) {
		const user = await AccountDB.findById(id);
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const session = await SessionService.createSession(user._id, {});

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: new UserService(user),
		};
	}

	getUser() {
		return this._account;
	}

	async updateDetails(opts: { name?: string; email?: string; phone?: string }) {
		const update: any = filterUndefinedKeys(opts);

		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			update
		);
		return {
			name: update.name ?? this._account.name,
			email: update.email ?? this._account.email,
			phone: update.phone ?? this._account.phone,
		};
	}

	async getDetails() {
		const details = {
			name: this._account.name,
			email: this._account.email,
			phone: this._account.phone,
		};

		return details;
	}

	public get walletBalance() {
		return this._account.walletBalance;
	}

	public get markupPrice() {
		return this._account.markupPrice;
	}

	static async register(
		email: string,
		password: string,
		opts: {
			name?: string;
			phone?: string;
			level: UserLevel;
			linked_to?: Types.ObjectId;
		}
	) {
		try {
			const user = await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
				parent: opts.linked_to,
			});

			sendLoginCredentialsEmail(email, email, password);
			return user._id;
		} catch (err) {
			throw new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS);
		}
	}

	static async generatePasswordResetLink(email: string) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const token = randomBytes(16).toString('hex');

		await StorageDB.setString(
			token,
			user._id.toString(),
			DateUtils.getMomentNow().add(20, 'minutes').toDate()
		);
		return token;
	}

	static async saveResetPassword(token: string, password: string) {
		const id = await StorageDB.getString(token);

		if (!id) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const user = await AccountDB.findOne({ _id: id }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		user.password = password;
		await user.save();

		await StorageDB.deleteOne({
			key: token,
		});
	}

	static async markLogout(token: string) {
		await SessionDB.deleteOne({
			refreshToken: token,
		});
	}

	public get userLevel() {
		return this._level;
	}

	public get userId() {
		return this._user_id;
	}

	public get account() {
		return this._account;
	}

	public async setMarkupPrice(rate: number) {
		if (rate < 0) {
			throw new CustomError(COMMON_ERRORS.INVALID_FIELDS);
		}
		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$set: {
					markupPrice: rate,
				},
			}
		);
	}

	public async getUsers() {
		if (this._level !== UserLevel.Master) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		const users = await AccountDB.aggregate([
			{
				$match: {
					userLevel: {
						$gte: UserLevel.Admin,
					},
				},
			},
		]);

		return users.map((user) => {
			return {
				id: user._id,
				name: user.name ?? '',
				email: user.email ?? '',
				phone: user.phone ?? '',
			};
		});
	}

	public async getAgents() {
		const users = await AccountDB.aggregate([
			{
				$match: {
					userLevel: UserLevel.Agent,
					parent: this._user_id,
				},
			},
		]);

		return users.map((user) => {
			return {
				id: user._id,
				name: user.name ?? '',
				email: user.email ?? '',
				phone: user.phone ?? '',
			};
		});
	}

	public async getAgent(id: Types.ObjectId) {
		const agent = await AccountDB.findOne({
			_id: id,
			parent: this._user_id,
		});

		if (!agent) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return agent;
	}

	async updateAgentDetails(
		id: Types.ObjectId,
		opts: { name?: string; email?: string; phone?: string }
	) {
		const update: any = filterUndefinedKeys(opts);

		await AccountDB.updateOne(
			{
				_id: id,
				parent: this._user_id,
			},
			update
		);

		const user = await AccountDB.findOne({
			_id: id,
			parent: this._user_id,
		});

		if (!user) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return {
			name: user.name ?? '',
			email: user.email ?? '',
			phone: user.phone ?? '',
		};
	}

	async updateAgentPassword(id: Types.ObjectId, password: string) {
		const user = await AccountDB.findOne({ _id: id }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		user.password = password;
		await user.save();
	}

	async removeAgent(id: Types.ObjectId) {
		await AccountDB.deleteOne({
			_id: id,
			parent: this._user_id,
		});
	}
}
