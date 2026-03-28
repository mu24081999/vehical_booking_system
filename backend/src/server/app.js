// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const routeLoader = require("../routes");
const errorHandler = require("../middlewares/errorHandler");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const app = express();

// Security
app.use(helmet());

// Body parser
app.use(express.json());

// CORS
app.use(cors());

// Logging
app.use(morgan("dev"));

// Compression (compress response before send.)
app.use(compression());

app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// Routes
app.use("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
routeLoader(app);

app.use(errorHandler);
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

module.exports = app;
