import { Response, Request } from "express";
import dotenv from "dotenv";
import { prismaClient } from "..";

dotenv.config();

export const createEvent = async (req: Request, res: Response) => {
  const { eventName, description, date, location } = req.body;
  const userId = req.user?.userId;

  if (!eventName) {
    return res
      .status(400)
      .json({ error: true, message: "Event name is required" });
  }

  if (!date) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a date" });
  }

  if (!userId) {
    return res
      .status(401)
      .json({ error: true, message: "User not authenticated" });
  }

  try {
    const event = await prismaClient.event.create({
      data: {
        userId,
        eventName,
        description,
        date,
        location,
      },
    });

    res.status(201).json({ event, message: "Event created successfully!" });
  } catch (err) {
    console.error("Error during e creation:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming `req.user` is populated with the authenticated user's information

  if (!userId) {
    return res
      .status(401)
      .json({ error: true, message: "User not authenticated" });
  }

  try {
    const events = await prismaClient.event.findMany({
      where: { userId },
    });

    res.json({
      events,
      message: "Events retrieved successfully!",
      error: false,
    });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const userId = req.user?.userId;

  try {
    const event = await prismaClient.event.delete({
      where: { id: eventId, userId },
    });

    if (!event) {
      return res.status(404).json({ error: true, message: "Event not found" });
    }

    return res.json({
      message: "Event deleted successfully!",
      error: false,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
