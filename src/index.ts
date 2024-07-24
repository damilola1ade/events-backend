import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const PORT = process.env.PORT;

const app: Express = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());

app.use("/", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
