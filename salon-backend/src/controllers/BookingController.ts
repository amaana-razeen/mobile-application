import { Request, Response } from "express";
import Booking from "../models/Booking";
import Notification from "../models/Notifications";

// Create Booking
export const createBooking = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Incoming booking body:", req.body);

    const {
      customerName,
      email,
      phone,
      service,
      date,
      time,
      status,
    } = req.body;

    if (!customerName || !email || !phone || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking fields.",
      });
    }

    const existing = await Booking.findOne({
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This time slot is not available.",
      });
    }

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      service,
      date,
      time,
      status: status || "Pending",
    });

    console.log("Saved booking:", booking);

    await Notification.create({
      title: "Appointment Booked",
      message: `${booking.customerName}, your appointment has been booked successfully.`,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

// Get All Bookings
export const getBookings = async (
  req: Request,
  res: Response
) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
    });
  }
};

export const checkAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const date = req.query.date as string;
    const time = req.query.time as string;

    const existing = await Booking.findOne({
      date,
      time,
    });

    res.json({
      available: !existing,
    });
  } catch (error) {
    res.status(500).json({
      available: false,
      message: "Error checking availability",
    });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};

// Update Booking Status
export const updateStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    let title = "";
    let message = "";

    switch (booking.status) {
      case "Approved":
        title = "Appointment Approved";
        message = `${booking.customerName}, your appointment has been approved.`;
        break;

      case "Cancelled":
        title = "Appointment Cancelled";
        message = `${booking.customerName}, your appointment has been cancelled.`;
        break;

      case "Completed":
        title = "Appointment Completed";
        message = `Thank you ${booking.customerName}! Your appointment has been completed.`;
        break;

      default:
        title = "Booking Updated";
        message = `Your appointment status is now ${booking.status}.`;
    }

    await Notification.create({
      title,
      message,
    });

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
    });
  }
};