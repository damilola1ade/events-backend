import { Router } from "express";
import authRoutes from "./auth";
import eventRoutes from "./event";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);

rootRouter.use("/event", eventRoutes);

export default rootRouter;
