const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middleware/auth-middleware");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/change-password", authenticateMiddleware, changePassword);

module.exports = authRouter;
