import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const HOST = process.env.HOST || "0.0.0.0";

const app = express();

app.use(cors({ credentials: true }));

app.use(express.json());

app.use("/", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
