import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  createTaskSchema,
  deleteTaskParamsSchema,
  getAllTasksQuerySchema,
  getTaskByIdParamsSchema,
  updateTaskBodySchema,
  updateTaskParamsSchema,
} from "../validators";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// CREATE Task
router.post(
  "/",
  authenticateToken,
  validateRequest({ body: createTaskSchema }),
  createTask
);

router.get(
  "/",
  authenticateToken,
  validateRequest({ query: getAllTasksQuerySchema }),
  getAllTasks
);

router.get(
  "/:id",
  authenticateToken,
  validateRequest({ params: getTaskByIdParamsSchema }),
  getTaskById
);

router.put(
  "/:id",
  authenticateToken,
  validateRequest({
    params: updateTaskParamsSchema,
    body: updateTaskBodySchema,
  }),
  updateTask
);

router.delete(
  "/:id",
  authenticateToken,
  validateRequest({ params: deleteTaskParamsSchema }),
  deleteTask
);

export default router;
