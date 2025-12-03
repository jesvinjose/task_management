import request from "supertest";
import express from "express";
import authRouter from "../routes/auth.routes";

// Mocks
jest.mock("../models/user.model");
jest.mock("bcryptjs");
jest.mock("../utils/token");

import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/token";
import { errorHandler } from "../middlewares/errorHandler.middleware";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use(errorHandler);

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /auth/loginUser - validateRequest middleware + Joi schema", () => {
  // EMPTY BODY → should fail validation
  it("should return 400 when body is empty", async () => {
    const res = await request(app).post("/auth/loginUser").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email is required");
  });

  // INVALID EMAIL FORMAT
  it("should return 400 for invalid email format", async () => {
    const res = await request(app).post("/auth/loginUser").send({
      email: "not-an-email",
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email format"); // FROM YOUR MESSAGES()
  });

  // MISSING EMAIL
  it("should return 400 when email is missing", async () => {
    const res = await request(app).post("/auth/loginUser").send({
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email is required");
  });

  // MISSING PASSWORD
  it("should return 400 when password is missing", async () => {
    const res = await request(app).post("/auth/loginUser").send({
      email: "test@example.com",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password is required");
  });

  // EMPTY PASSWORD STRING
  it("should return 400 when password is empty string", async () => {
    const res = await request(app).post("/auth/loginUser").send({
      email: "test@example.com",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"password" is not allowed to be empty');
  });

  // EMPTY EMAIL STRING
  it("should return 400 when email is empty string", async () => {
    const res = await request(app).post("/auth/loginUser").send({
      email: "",
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"email" is not allowed to be empty');
  });

  // USER NOT FOUND
  it("returns 401 when user not found", async () => {
    // ensure validation passes — send valid body
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app)
      .post("/auth/loginUser")
      .send({ email: "NoUser@Example.COM", password: "any-pass" });

    // email should be lowercased inside controller
    expect(User.findOne).toHaveBeenCalledWith({ email: "nouser@example.com" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // PASSWORD IS INCORRECT
  it("returns 401 when password is incorrect", async () => {
    const fakeUser = { email: "user@example.com", password: "hashedpw" };
    (User.findOne as jest.Mock).mockResolvedValueOnce(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const res = await request(app)
      .post("/auth/loginUser")
      .send({ email: "user@example.com", password: "wrongpassword" });

    expect(User.findOne).toHaveBeenCalledWith({ email: "user@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpw");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // SUCCESS LOGIN
  it("returns 200 and an accessToken on successful login", async () => {
    const fakeUser = {
      _id: { toString: () => "692f520d8b00c2b09e7bfaee" },
      email: "alice@example.com",
      password: "$2b$10$EmY/9NLedQLQO3m924yldOpPFJ0fTRVh0dSJ0P7VnnmUXP3p0Dbfq",
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (generateAccessToken as jest.Mock).mockReturnValueOnce(
      "mocked-access-token"
    );

    const res = await request(app)
      .post("/auth/loginUser")
      .send({ email: "alice@example.com", password: "Str0ngP@ssw0rd" });

    expect(User.findOne).toHaveBeenCalledWith({ email: "alice@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "Str0ngP@ssw0rd",
      "$2b$10$EmY/9NLedQLQO3m924yldOpPFJ0fTRVh0dSJ0P7VnnmUXP3p0Dbfq"
    );
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: "692f520d8b00c2b09e7bfaee",
      email: "alice@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.accessToken).toBe("mocked-access-token");
  });

  // INTERNAL SERVER ERROR CASE
  it("returns 500 when User.findOne throws an error", async () => {
    (User.findOne as jest.Mock).mockRejectedValueOnce(new Error("DB failure"));

    const res = await request(app)
      .post("/auth/loginUser")
      .send({ email: "valid@example.com", password: "valid123" }); // must pass Joi

    expect(res.status).toBe(500);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("DB failure");
    expect(res.body.is_show).toBe(true);
  });
});
