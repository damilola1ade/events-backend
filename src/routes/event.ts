import { Router } from "express";
import { createEvent, deleteEvent, getAllEvents } from "../controllers/event";
import { authenticateToken } from "../middlewares/authenticateToken";

const eventRoutes: Router = Router();

eventRoutes.post("/create-event", authenticateToken, createEvent);
eventRoutes.get("/get-all-events", authenticateToken, getAllEvents);
eventRoutes.delete("/delete-event/:eventId", authenticateToken, deleteEvent);

export default eventRoutes;
