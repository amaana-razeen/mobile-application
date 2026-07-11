import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import recommendedRoutes from "./routes/recommendedRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// makes uploaded images reachable at http://<host>:<port>/uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/recommended", recommendedRoutes);

app.get("/", (req, res) => {
  res.send("Salon Backend API running 🚀");
});

export default app;