import mongoose from 'mongoose';
import { ITaskManager } from '../types/taskManager';
import { AccountDB_name } from './Account';

const TaskManagerSchema = new mongoose.Schema<ITaskManager>(
	{
		assignedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
			index: 1,
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
			index: 1,
		},
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task',
			required: true,
			index: 1,
		},
		level: {
			type: Number,
			default: 1,
			required: true,
		},
	},
	{ timestamps: true }
);

TaskManagerSchema.index({ assignedBy: 1, assignedTo: 1, taskId: 1 }, { unique: true });

export const TaskManagerDB_name = 'TaskManager';

const TaskManager = mongoose.model<ITaskManager>(TaskManagerDB_name, TaskManagerSchema);
export default TaskManager;
