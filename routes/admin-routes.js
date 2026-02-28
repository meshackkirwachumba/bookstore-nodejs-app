const express = require("express");
const authenticateMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/admin-middleware");

const adminRouter = express.Router();

adminRouter.get("/welcome", authenticateMiddleware, isAdminUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "welcome to the admin page",
  });
});

module.exports = adminRouter;
