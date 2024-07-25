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

  if (!location) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a location" });
  }

  if (!description) {
    return res.status(400).json({
      error: true,
      message: "Please provide a proper description of the event",
    });
  }

  if (!userId) {
    return res
      .status(401)
      .json({ error: true, message: "User not authenticated" });
  }

  try {
    const event = await prismaClient.event.create({
      data: {
        eventName,
        description,
        date,
        location,
        createdBy: { connect: { id: userId } }, //Remove this if you want user to have unique events
      },
    });

    res
      .status(201)
      .json({ event, message: "Event created successfully!", error: false });
  } catch (err) {
    console.error("Error during event creation:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ error: true, message: "User not authenticated" });
  }

  try {
    const events = await prismaClient.event.findMany({
      include: { createdBy: true },
    });

    // Use this if you want each user to have unique events

    // const events = await prismaClient.event.findMany({
    //   where: { userId },
    // });

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

export const getSingleEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ error: true, message: "User not authenticated" });
  }

  try {
    const event = await prismaClient.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        error: true,
        message: "Event not found or you don't have permission to access it.",
      });
    }

    res.json({
      event,
      message: "Event retrieved successfully!",
      error: false,
    });
  } catch (error) {
    console.error("Error retrieving event:", error);
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

export const updateEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const userId = req.user?.userId;

  try {
    const event = await prismaClient.event.update({
      where: { id: eventId, userId },
      data: { ...req.body },
    });

    return res.json({
      event,
      message: "Event updated successfully!",
      error: false,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
