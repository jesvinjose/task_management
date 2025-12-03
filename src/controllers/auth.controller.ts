// src/controllers/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateAccessToken } from "../utils/token";
import { sendApiResponse } from "../utils/sendApiResponse";


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
    const accessToken = generateAccessToken(payload);

    return sendApiResponse(res, 200, true, "Login successful", {
      data: {
        accessToken,
      },
      is_show: true,
    });
  } catch (error:any) {
    // console.error("Login Error:", error.message);
    next(error);
  }
};


