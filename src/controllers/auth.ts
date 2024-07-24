import { Response, Request } from "express";
import { prismaClient } from "..";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const tokenBlacklist = new Set();

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: true, message: "Your full name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  try {
    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "30m",
    });

    res
      .status(201)
      .json({ user, accessToken, message: "Registration successful!" });
  } catch (err) {
    console.error("Error during user creation:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    return res
      .status(400)
      .json({ error: true, message: "User does not exist" });
  }

  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "5h",
        }
      );
      res.json({
        user,
        accessToken,
        message: "Login successful",
        error: false,
      });
    } else {
      res.status(401).json({ error: true, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  const { accessToken } = req.body;
  if (accessToken) {
    tokenBlacklist.add(accessToken);
    res.status(200).json({ message: "Logged out successfully" });
  }
};
