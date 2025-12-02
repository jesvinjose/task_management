import { Router } from "express";
import { loginUser } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { loginUserSchema } from "../validators";

const router = Router();

// Login a new user
router.post(
  "/loginUser",
  validateRequest({ body: loginUserSchema }),
  loginUser
);

export default router;
