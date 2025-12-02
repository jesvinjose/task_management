import { Request, Response, NextFunction } from "express";
import { sendApiResponse } from "../utils/sendApiResponse";

interface ValidatorSchema {
  body?: any;
  params?: any;
  query?: any;
}

export const validateRequest = (schema: ValidatorSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (schema.body) {
        const { error, value } = schema.body.validate(req.body);
        if (error) {
          return sendApiResponse(res, 400, false, error.details[0].message, {
            is_show: true,
          });
        }
        req.body = value; // sanitized values
      }

      // Validate params
      if (schema.params) {
        const { error, value } = schema.params.validate(req.params);
        if (error) {
          return sendApiResponse(res, 400, false, error.details[0].message, {
            is_show: true,
          });
        }
        Object.assign(req.params, value);
      }

      // Validate query
      if (schema.query) {
        const { error, value } = schema.query.validate(req.query);
        if (error) {
          return sendApiResponse(res, 400, false, error.details[0].message, {
            is_show: true,
          });
        }
        Object.assign(req.query, value);
      }

      next();
    } catch (err) {
      console.error(err);
      return sendApiResponse(res, 500, false, "Validation error", {
        is_show: true,
      });
    }
  };
};
