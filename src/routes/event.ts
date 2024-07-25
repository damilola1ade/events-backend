import { Router } from "express";
import { createEvent, deleteEvent, getAllEvents, getSingleEvent, updateEvent } from "../controllers/event";
import { authenticateToken, adminMiddleWare } from "../middlewares";

const eventRoutes: Router = Router();

eventRoutes.post("/create-event", [authenticateToken, adminMiddleWare], createEvent);
eventRoutes.get("/get-all-events", [authenticateToken], getAllEvents);
eventRoutes.get("/get-event/:eventId", [authenticateToken], getSingleEvent);
eventRoutes.delete("/delete-event/:eventId", [authenticateToken, adminMiddleWare], deleteEvent);
eventRoutes.put("/update-event/:eventId", [authenticateToken, adminMiddleWare], updateEvent);

export default eventRoutes;
