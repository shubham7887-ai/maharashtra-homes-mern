import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Maharashtra Homes API" }));
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const port = process.env.PORT || 5000;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(port, () => console.log(`API listening on ${port}`)))
    .catch((err) => { console.error("MongoDB connection failed:", err.message); process.exit(1); });
} else {
  console.error("Missing MONGODB_URI. Copy server/.env.example to server/.env and configure it.");
  process.exit(1);
}
