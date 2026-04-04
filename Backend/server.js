require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// --- GLOBAL MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());

// ✅ THIS IS THE MAGIC LINE YOU NEEDED:
// It tells Express to let the frontend access images inside the "uploads" folder
app.use("/uploads", express.static("uploads"));
app.use("/api/users", require("./routes/userRoutes"));
// --- DATABASE CONNECTION ---
connectDB();

// --- LOGGER ---
app.use((req, res, next) => {
  console.log(" HIT:", req.method, req.originalUrl);
  next();
});

// --- BASIC ROUTE ---
app.get("/", (req, res) => {
  res.send("HireHelper Backend Running ");
});

// --- ROUTES ---
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    msg: "Protected route working ",
    userId: req.userId
  });
});

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const requestRoutes = require("./routes/requestRoutes");
app.use("/requests", requestRoutes);
// FOR NOTIFICATIONS
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/notifications", notificationRoutes);
// --- START SERVER ---
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

