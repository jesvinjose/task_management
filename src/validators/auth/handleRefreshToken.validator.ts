import Joi from "joi";

export const handleRefreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});
