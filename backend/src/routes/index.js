const authRoutes = require("./auth.route");
const customerRoutes = require("./customer.route");
const vehicleRoutes = require("./vehicle.route");
const bookingRoutes = require("./booking.route");

const routeLoader = (app) => {
  app.use("/api/v1", authRoutes);
  app.use("/api/v1", customerRoutes);
  app.use("/api/v1", vehicleRoutes);
  app.use("/api/v1", bookingRoutes);
};
module.exports = routeLoader;
