// src/controllers/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateTokens, verifyRefreshToken } from "../utils/token";
import { sendApiResponse } from "../utils/sendApiResponse";
import { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return sendApiResponse(res, 401, false, "Invalid credentials", {
        is_show: true,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendApiResponse(res, 401, false, "Invalid credentials", {
        is_show: true,
      });
    }

    const payload = { id: user._id.toString(), email: user.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    return sendApiResponse(res, 200, true, "Login successful", {
      data: {
        accessToken,
        refreshToken,
      },
      is_show: true,
    });
  } catch (error) {
    console.error("Login Error:", error);
    next(error);
  }
};

export const handleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return sendApiResponse(res, 401, false, "Refresh token required", {
        is_show: true,
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refresh_token) as MyJwtPayload;
    } catch (error: any) {
      return sendApiResponse(
        res,
        401,
        false,
        "Invalid or expired refresh token",
        {
          is_show: true,
        }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendApiResponse(res, 401, false, "User not found", {
        is_show: true,
      });
    }

    const payload = { id: user._id, email: user.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    return sendApiResponse(res, 200, true, "Token refreshed", {
      data: {
        accessToken,
        refreshToken,
      },
      is_show: true,
    });
  } catch (error: any) {
    console.error("Refresh Token Error:", error);
    // Token errors are 401
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return sendApiResponse(
        res,
        401,
        false,
        "Invalid or expired refresh token",
        { is_show: true }
      );
    }
    // Unexpected errors → pass to global handler
    next(error);
  }
};
