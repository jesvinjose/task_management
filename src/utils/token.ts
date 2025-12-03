import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET!;

const accessExpiry = (process.env.JWT_ACCESS_EXPIRES_IN ||
  "15m") as jwt.SignOptions["expiresIn"];

export const generateAccessToken = (payload: object) => {
  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiry,
  });
  return accessToken;
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret);
};

