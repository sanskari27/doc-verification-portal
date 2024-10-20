import { Document, Types } from 'mongoose';
import { UserLevel } from '../../src/config/const';

export default interface IAccount extends Document {
	_id: Types.ObjectId;
	parent: Types.ObjectId;
	name: string;
	phone: string;
	email: string;
	userLevel: UserLevel;
	disabled: boolean;

	verifyPassword(password: string): Promise<boolean>;
}
