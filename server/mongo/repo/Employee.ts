import mongoose from 'mongoose';
import { EmployeeLevel } from '../../src/config/const';
import IEmployee from '../types/employee';
import { AccountDB_name } from './Account';

export const EmployeeDB_name = 'Employee';

const schema = new mongoose.Schema<IEmployee>({
	manager_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: EmployeeDB_name,
		required: true,
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: EmployeeDB_name,
		required: true,
	},
	account_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	employee_type: {
		type: String,
		enum: Object.values(EmployeeLevel),
		required: true,
	},
	name: String,
	email: String,
	phone: String,
});

schema.index({ account_id: 1, organization: 1 }, { unique: true });

const EmployeeDB = mongoose.model<IEmployee>(EmployeeDB_name, schema);

export default EmployeeDB;
