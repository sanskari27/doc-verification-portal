import { Document, Types } from 'mongoose';

export interface ITaskManager extends Document {
	_id: Types.ObjectId;
	assignedBy: Types.ObjectId;
	assignedTo: Types.ObjectId;
	taskId: Types.ObjectId;
	level: number;
}
