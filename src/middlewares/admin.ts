import { Request, NextFunction, Response } from "express";
import { prismaClient } from "..";

export const adminMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.sendStatus(401);
    }

    const user = await prismaClient.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || user.role !== "ADMIN") {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.error("Error in adminMiddleWare:", error);
    res.sendStatus(500);
  }
};
