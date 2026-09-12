const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use(
  "/api/inspections",
  inspectionRoutes
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "METRALENS AI backend is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;