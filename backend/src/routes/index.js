const authRoutes = require("./auth.route");

const routeLoader = (app) => {
  app.use("/api/v1", authRoutes);
};
module.exports = routeLoader;
