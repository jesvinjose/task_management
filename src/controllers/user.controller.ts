import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { sendApiResponse } from "../utils/sendApiResponse";

// Create a new user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return sendApiResponse(res, 400, false, "Email already in use", {
        is_show: true,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return sendApiResponse(res, 201, true, "User registered successfully", {
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      is_show: true,
    });
  } catch (error) {
    console.error("Register User Error:", error);
    next(error);
  }
};
