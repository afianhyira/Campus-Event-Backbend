// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./src/config/db");
// const authRoutes = require("./src/routes/authRoutes");
// const eventRoutes = require("./src/routes/eventRoutes");
// const adminRoutes = require("./src/routes/adminRoutes");

// // Load environment variables
// dotenv.config();

// // Connect to the database
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/admin", adminRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

// const PORT = process.env.PORT || 5001;

// // Modified server startup with error handling
// const server = app
//   .listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   })
//   .on("error", (err) => {
//     if (err.code === "EADDRINUSE") {
//       console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}`);
//       server.listen(PORT + 1);
//     } else {
//       console.error("Server error:", err);
//     }
//   });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// var whitelist = [
//   "https://campusevents-five.vercel.app/events/*",
//   "http://campusevents-five.vercel.app/events/*",
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
var corsOptions = {
  origin: [
    "https://campusevents-five.vercel.app/",
    "http://localhost:5173/",
    "http://campusevents-five.vercel.app/",
  ],
  // optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
