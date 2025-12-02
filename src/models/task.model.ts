import mongoose, { Schema, Document } from "mongoose";

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum TaskStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Done = "Done",
}

export interface ITask extends Document {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  userId: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      required: true,
      default: TaskPriority.Medium,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true,
      default: TaskStatus.Pending,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
