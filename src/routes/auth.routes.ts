import { Router } from "express";
import { handleRefreshToken, loginUser } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { handleRefreshTokenSchema, loginUserSchema } from "../validators";

const router = Router();

// Login a new user
router.post(
  "/loginUser",
  validateRequest({ body: loginUserSchema }),
  loginUser
);

// Handle refresh token for new tokens
router.post(
  "/handleRefreshToken",
  validateRequest({ body: handleRefreshTokenSchema }),
  handleRefreshToken
);

export default router;
