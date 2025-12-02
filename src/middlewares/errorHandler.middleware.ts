import { Request, Response, NextFunction } from "express";
import { sendApiResponse } from "../utils/sendApiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return sendApiResponse(res, statusCode, false, message, {
    is_show: true,
  });
};
