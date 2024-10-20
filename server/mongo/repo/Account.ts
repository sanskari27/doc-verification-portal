import mongoose from 'mongoose';
import IAccount from '../types/account';

export const AccountDB_name = 'Account';

const schema = new mongoose.Schema<IAccount>({
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
	},
	name: {
		type: String,
	},
	phone: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},
	userLevel: {
		type: Number,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

schema.index({ email: 1 }, { unique: true });

const AccountDB = mongoose.model<IAccount>(AccountDB_name, schema);

export default AccountDB;
