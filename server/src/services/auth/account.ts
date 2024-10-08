import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { AccountDB, SessionDB, StorageDB, IAccount } from '../../../mongo';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import { sendLoginCredentialsEmail } from '../../provider/email';
import { IDType } from '../../types';
import DateUtils from '../../utils/DateUtils';
import { filterUndefinedKeys } from '../../utils/ExpressUtils';
import SessionService from './session';

type SessionDetails = {
	ipAddress?: string;
	platform?: string;
	browser?: string;
	latitude?: number;
	longitude?: number;
};

export default class AccountService {
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

		return new AccountService(account);
	}

	static async login(email: string, password: string, opts: SessionDetails) {
		const user = await AccountDB.findOne({ email, disabled: false }).select('+password');
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
			userService: new AccountService(user),
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
			AccountService: new AccountService(user),
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
			id: this._user_id,
			name: this._account.name,
			email: this._account.email,
			phone: this._account.phone,
			userLevel: this._account.userLevel,
			parent_id: this._account.parent,
		};

		return details;
	}

	isOwner() {
		return this._level === UserLevel.Master;
	}

	static async register(
		email: string,
		password: string,
		opts: {
			name?: string;
			phone?: string;
			level: UserLevel;
			parent?: Types.ObjectId;
		}
	) {
		try {
			const user = await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
				parent: opts.parent,
			});

			sendLoginCredentialsEmail(email, email, password);
			return user._id;
		} catch (err) {
			const user = await AccountDB.findOne({ email });
			if (user?.disabled) {
				user.disabled = false;
				user.password = password;
				await user.save();
				sendLoginCredentialsEmail(email, email, password);
				return user._id;
			}

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
}
