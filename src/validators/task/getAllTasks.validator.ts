import Joi from "joi";

export const getAllTasksQuerySchema = Joi.object({
  status: Joi.string()
    .valid("Pending", "In Progress", "Done")
    .optional()
    .messages({
      "any.only": "status must be one of: Pending, In Progress, Done",
    }),

  priority: Joi.string().valid("Low", "Medium", "High").optional().messages({
    "any.only": "priority must be one of: Low, Medium, High",
  }),

  sortBy: Joi.string()
    .valid("priority", "createdAt")
    .optional()
    .default("createdAt")
    .messages({
      "any.only": "sortBy must be one of: priority, createdAt",
    }),

  order: Joi.string().valid("asc", "desc").optional().default("desc").messages({
    "any.only": "order must be either asc or desc",
  }),

  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "page must be a number",
    "number.min": "page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).optional().default(10).messages({
    "number.base": "limit must be a number",
    "number.min": "limit must be at least 1",
  }),
});
