import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { registerUserSchema } from "../validators";

const router = Router();

// Register a new user
router.post(
  "/registerUser",
  validateRequest({ body: registerUserSchema }),
  registerUser
);

export default router;
