import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

const accessExpiry = (process.env.JWT_ACCESS_EXPIRES_IN ||
  "10m") as jwt.SignOptions["expiresIn"];
const refreshExpiry = (process.env.JWT_REFRESH_EXPIRES_IN ||
  "1d") as jwt.SignOptions["expiresIn"];

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiry,
  });
  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiry,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshSecret);
};
