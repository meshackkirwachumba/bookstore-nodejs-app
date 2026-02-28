const cloudinaryConfig = require("../config/cloudinaryConfig");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const imageModel = require("../models/imageModel");
const fs = require("fs");

const uploadImageCtrl = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "File is required.Please select an image to upload to cloudinary",
      });
    }
    //upload image to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with the uploaded user id in database
    const newlyUploadedImage = new imageModel({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //delete the file image from local storage ie uploads folder
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      sucess: true,
      message: "image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong!Please try again",
    });
  }
};

const fetchAllImagesController = async (req, res) => {
  try {
    //req.query.page selects page to view ie page 1, page 2, page 3 etc
    const selectedPage = parseInt(req.query.page) || 1;
    //req.query.limit limits the amount of information potrayed
    const limit = parseInt(req.query.limit) || 5;
    //skip limit amount to reach that page
    const skip = (selectedPage - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await imageModel.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await imageModel
      .find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: selectedPage,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong!Please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const getCurrentOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;

    const image = await imageModel.findById(getCurrentOfImageToBeDeleted);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "image not found!",
      });
    }

    //check if this image is uploaded by the current user who is trying to delete it
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image",
      });
    }

    //delete this image first from your cloudinary storage
    await cloudinaryConfig.uploader.destroy(image.publicId);

    //delete this image from mongodb database
    await imageModel.findByIdAndDelete(getCurrentOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      message: "image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong!Please try again",
    });
  }
};

module.exports = {
  uploadImageCtrl,
  fetchAllImagesController,
  deleteImageController,
};
