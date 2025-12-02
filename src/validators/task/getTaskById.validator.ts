import Joi from "joi";

export const getTaskByIdParamsSchema = Joi.object({
  id: Joi.string().length(24).required().messages({
    "string.length": "Invalid task ID format",
    "any.required": "Task ID is required",
  }),
});
