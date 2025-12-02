import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().allow("").optional(),

  priority: Joi.string()
    .valid("Low", "Medium", "High")
    .required()
    .messages({
      "any.only": "Priority must be Low, Medium, or High",
      "string.empty": "Priority is required",
      "any.required": "Priority is required",
    }),

  status: Joi.string()
    .valid("Pending", "InProgress", "Completed")
    .required()
    .messages({
      "any.only": "Status must be Pending, InProgress, or Completed",
      "string.empty": "Status is required",
      "any.required": "Status is required",
    }),
});
