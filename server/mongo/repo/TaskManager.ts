import mongoose from 'mongoose';
import { ITaskManager } from '../types/taskManager';
import { AccountDB_name } from './Account';

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
			ref: 'Task',
			required: true,
		},
		level: {
			type: Number,
			default: 1,
			required: true,
		},
	},
	{ timestamps: true }
);

export const TaskManagerDB_name = 'TaskManager';

const TaskManager = mongoose.model<ITaskManager>(TaskManagerDB_name, TaskManagerSchema);
export default TaskManager;
