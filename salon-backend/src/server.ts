import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import {connectDB}  from "./config/db";
import serviceRoutes from "./routes/serviceRoutes";
import userRoutes from "./routes/userRoutes";
import recommendedRoutes from "./routes/recommendedRoutes";
import bookingRoutes from "./routes/BookingRoutes";
import notificationRoutes from "./routes/NotificationRoutes";


dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config(); // ← must be BEFORE connectDB()

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recommended", recommendedRoutes);
app.use("/notifications", notificationRoutes);

app.use(express.json());

app.use("/api/bookings", bookingRoutes);

app.use("/uploads", express.static("uploads"));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log (`Server running on port ${PORT}`);
  });
}); 