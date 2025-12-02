import Joi from "joi";

export const deleteTaskParamsSchema = Joi.object({
  id: Joi.string().length(24).required().messages({
    "string.length": "Invalid task ID format",
    "any.required": "Task ID is required",
  }),
});
