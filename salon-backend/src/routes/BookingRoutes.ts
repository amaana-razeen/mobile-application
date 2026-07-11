import express from "express";
import {
  createBooking,
  getBookings,
  updateStatus,
  deleteBooking,
  checkAvailability
} from "../controllers/BookingController";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.put("/:id", updateStatus);
router.delete("/:id", deleteBooking);
router.get("/check", checkAvailability);

export default router;