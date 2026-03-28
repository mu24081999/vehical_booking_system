const jwt = require("jsonwebtoken");
const Response = require("../utils/responseHelper");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return Response.unauthorized(res, "Unauthorized access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return Response.unauthorized(res, "Invalid or expired token");
  }
};

module.exports = authenticate;
