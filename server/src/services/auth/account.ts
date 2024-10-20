import { Types } from 'mongoose';
import { AccountDB, IAccount, SessionDB, StorageDB } from '../../../mongo';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import { IDType } from '../../types';
import { filterUndefinedKeys, generateRandomNumber, generateText } from '../../utils/ExpressUtils';
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

	static async generateLoginToken(email: string) {
		const user = await AccountDB.findOne({ email });
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const otp = generateRandomNumber(6);
		const token = generateText(32);
		await StorageDB.setObject(token, { id: user._id, otp: otp });

		return {
			token,
			otp,
		};
	}

	static async login(token: string, otp: string, opts: SessionDetails) {
		const storage = await StorageDB.getObject(token);
		if (!storage) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const { id, otp: savedOTP } = storage;
		if (otp.toString() !== savedOTP.toString()) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const user = await AccountDB.findOne({ _id: id, disabled: false });
		if (user === null) {
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
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
				parent: opts.parent,
			});

			return user._id;
		} catch (err) {
			const user = await AccountDB.findOne({ email });
			if (user?.disabled) {
				user.disabled = false;
				await user.save();
				return user._id;
			}

			throw new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS);
		}
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
