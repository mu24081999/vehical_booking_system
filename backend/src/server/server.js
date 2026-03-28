// src/server.js
require("../config/dotenv");
const app = require("./app");
const DBconnection = require("../connection/db");
const logger = require("../utils/logger");

const PORT = process.env.PORT || 5000;

// Start server
const server = DBconnection.then(() => {
  if (process.env.NODE_ENV !== "test")
    return app.listen(PORT, () => {
      logger.log(`Server listening on port: ${PORT}`);
    });
}).catch((error) => {
  error.status = error.statusCode || error.status || 500;
  logger.error(error);
  return Promise.reject(error);
});
// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => {
    logger.log("Process terminated");
  });
});
