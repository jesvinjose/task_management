import Joi from "joi";

export const updateTaskParamsSchema = Joi.object({
  id: Joi.string().length(24).required().messages({
    "string.length": "Invalid task ID format",
    "any.required": "Task ID is required",
  }),
});

export const updateTaskBodySchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title must be a string",
    "any.required": "Title is required",
  }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string",
  }),

  priority: Joi.string().valid("Low", "Medium", "High").required().messages({
    "any.only": "Priority must be Low, Medium, or High",
    "any.required": "Priority is required",
  }),

  status: Joi.string()
    .valid("Pending", "In Progress", "Completed")
    .required()
    .messages({
      "any.only": "Status must be Pending, In Progress, or Completed",
      "any.required": "Status is required",
    }),
});
