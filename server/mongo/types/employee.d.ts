import { Document, Types } from 'mongoose';
import { EmployeeLevel } from '../../src/config/const';

export default interface IEmployee extends Document {
	_id: Types.ObjectId;

	account_id: Types.ObjectId;
	manager_id: Types.ObjectId;
	parent: Types.ObjectId;

	employee_type: EmployeeLevel;
	disabled: boolean;

	name: string;
	email: string;
	phone: string;
}
