import { NextFunction, Request, Response } from "express";
import { sendApiResponse } from "../utils/sendApiResponse";
import { HttpError } from "../utils/httpError";
import Task from "../models/task.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { title, description = "", priority, status } = req.body;

    if (!title || !priority || !status) {
      throw new HttpError(400, "Missing required fields");
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      userId: user.id,
    });

    return sendApiResponse(res, 201, true, "Task created successfully", {
      data: task,
      is_show: true,
    });
  } catch (err: any) {
    next(err);
  }
};

// GET /tasks – get all tasks of logged-in user
export const getAllTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;

    // Query params
    const {
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query as any;

    // Filtering object
    const filters: any = { userId: user.id };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // Sorting
    const sort: any = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // Fetch data
    const [tasks, totalCount] = await Promise.all([
      Task.find(filters).sort(sort).skip(skip).limit(limitNumber),
      Task.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    return sendApiResponse(
      res,
      200,
      true,
      "Tasks of the logged in user found successfully",
      {
        data: tasks,
        pagination: {
          totalPages,
          totalCount,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
          currentPage: pageNumber,
        },
        is_show: true,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    if (!id) {
      throw new HttpError(400, "Task ID is required");
    }

    const task = await Task.findOne({
      _id: id,
      userId: user.id, // Ensure user can only view their own tasks
    });

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    return sendApiResponse(res, 200, true, "Task fetched successfully", {
      data: task,
      is_show: true,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { title, description = "", priority, status } = req.body;

    if (!id) {
      throw new HttpError(400, "Task ID is required");
    }

    // Validation will already ensure: title, priority, status exist
    // validateRequest -> createTaskSchema handles this

    // Find task belonging to user
    const task = await Task.findOne({
      _id: id,
      userId: user.id,
    });

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    // Overwrite with new validated data
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.status = status;

    await task.save();

    return sendApiResponse(res, 200, true, "Task updated successfully", {
      data: task,
      is_show: true,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    if (!id) {
      throw new HttpError(400, "Task ID is required");
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: user.id, // Only delete user's own tasks
    });

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    return sendApiResponse(res, 200, true, "Task deleted successfully", {
      data: task,
      is_show: true,
    });
  } catch (err) {
    next(err);
  }
};
