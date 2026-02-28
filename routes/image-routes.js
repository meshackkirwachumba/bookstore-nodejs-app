const express = require("express");
const authenticateMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware.js");
const {
  uploadImageCtrl,
  fetchAllImagesController,
  deleteImageController,
} = require("../controllers/image-controllers.js");

const imageRouter = express.Router();

//upload the image
imageRouter.post(
  "/upload",
  authenticateMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImageCtrl,
);
//get all images
imageRouter.get("/get", authenticateMiddleware, fetchAllImagesController);

//delete image by id
imageRouter.delete(
  "/:id",
  authenticateMiddleware,
  isAdminUser,
  deleteImageController,
);

module.exports = imageRouter;
