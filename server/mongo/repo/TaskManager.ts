import mongoose from 'mongoose';
import { ITaskManager } from '../types/taskManager';
import { AccountDB_name } from './Account';
import { TaskDB_name } from './Task';

const TaskManagerSchema = new mongoose.Schema<ITaskManager>(
	{
		assignedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: TaskDB_name,
			required: true,
		},
		level: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export const TaskManagerDB_name = 'TaskManager';

export default mongoose.model<ITaskManager>(TaskManagerDB_name, TaskManagerSchema);
