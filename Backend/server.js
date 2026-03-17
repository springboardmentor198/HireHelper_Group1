require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// --- GLOBAL MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());

<<<<<<< HEAD
// ✅ THIS IS THE MAGIC LINE YOU NEEDED:
=======
>>>>>>> 9342359e0ad5a1640f6c35dc9ac2d44135747b18
// It tells Express to let the frontend access images inside the "uploads" folder
app.use("/uploads", express.static("uploads"));

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

// --- START SERVER ---
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
<<<<<<< HEAD
});

=======
});
>>>>>>> 9342359e0ad5a1640f6c35dc9ac2d44135747b18
