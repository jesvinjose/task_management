import request from "supertest";
import express, { NextFunction, Request, Response } from "express";

// Router - adjust path if your file is elsewhere
import userRouter from "../routes/user.routes";

// Mocks
jest.mock("../models/user.model");
jest.mock("bcryptjs");

import User from "../models/user.model";
import bcrypt from "bcryptjs";

// IMPORT GLOBAL ERROR HANDLER
import { errorHandler } from "../middlewares/errorHandler.middleware";

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use(errorHandler);

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /users/registerUser (controller)", () => {
  it("returns 400 when email already exists", async () => {
    // mock existing user found
    const existing = {
      _id: "existingid",
      name: "Alice",
      email: "alice@example.com",
      password: "somehash",
    };
    (User.findOne as jest.Mock).mockResolvedValueOnce(existing);

    const res = await request(app).post("/users/registerUser").send({
      name: "New Name",
      email: "Alice@Example.COM", // intentionally mixed-case to test normalization
      password: "Str0ngP@ssw0rd",
    });

    // Controller should lowercase email before checking
    expect(User.findOne).toHaveBeenCalledWith({ email: "alice@example.com" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email already in use");
    expect(res.body.status).toBe(false);
  });

  it("returns 201 and user data on successful registration", async () => {
    // no existing user
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    // mock bcrypt
    (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce("salt-value");
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashed-password");

    // mock created user returned by User.create
    const createdUser = {
      _id: "692f520d8b00c2b09e7bfaef",
      name: "Bob",
      email: "bob@example.com",
      password: "hashed-password",
    };
    (User.create as jest.Mock).mockResolvedValueOnce(createdUser);

    const res = await request(app).post("/users/registerUser").send({
      name: "Bob",
      email: "Bob@Example.com", // mixed case to verify normalization
      password: "Str0ngP@ssw0rd",
    });

    // findOne should be called with normalized (lowercase) email
    expect(User.findOne).toHaveBeenCalledWith({ email: "bob@example.com" });

    // bcrypt should be used to hash password
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10); // your controller uses 10
    expect(bcrypt.hash).toHaveBeenCalledWith("Str0ngP@ssw0rd", "salt-value");

    // create should be called with normalized email and hashed password
    expect(User.create).toHaveBeenCalledWith({
      name: "Bob",
      email: "bob@example.com",
      password: "hashed-password",
    });

    // Response assertions
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(createdUser._id);
    expect(res.body.data.name).toBe(createdUser.name);
    expect(res.body.data.email).toBe(createdUser.email);
  });

  it("calls next(error) when User.findOne throws (internal error)", async () => {
    (User.findOne as jest.Mock).mockRejectedValueOnce(new Error("DB failure"));

    const res = await request(app).post("/users/registerUser").send({
      name: "Test User",
      email: "x@example.com",
      password: "password",
    });

    // Should be handled by YOUR global errorHandler
    expect(res.status).toBe(500);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("DB failure");
    expect(res.body.is_show).toBe(true);
  });
});
