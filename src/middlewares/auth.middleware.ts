import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { sendApiResponse } from "../utils/sendApiResponse";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendApiResponse(res, 401, false, "Authorization token missing", {
      is_show: true,
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(accessToken) as {
      id: string;
      email: string;
    };
    // Fetch full user from DB
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return sendApiResponse(res, 401, false, "User not found", {
        is_show: true,
      });
    }

    const { _id, name, email } = user;
    req.user = {
      id: _id.toString(),
      name,
      email,
    };

    next();
  } catch (err: any) {
    if (err instanceof jwt.TokenExpiredError) {
      return sendApiResponse(res, 401, false, "Access token expired", {
        is_show: true,
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return sendApiResponse(res, 401, false, "Invalid access token", {
        is_show: true,
      });
    }
    console.error("Token verification failed:", err);
    return sendApiResponse(res, 500, false, "Token verification failed", {
      is_show: true,
    });
  }
};
