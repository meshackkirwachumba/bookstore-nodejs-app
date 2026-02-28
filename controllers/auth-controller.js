const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //existing user
    existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "user already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const user = await newUser.save();

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong!!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: "user not found with that email!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(500).json({
        success: false,
        message: "invalid credentials!",
      });
    }

    //generate user token
    const accessToken = jwt.sign(
      {
        userId: foundUser._id,
        username: foundUser.username,
        role: foundUser.role,
        email: foundUser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    res.status(200).json({
      success: true,
      message: "login successful",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong!!",
    });
  }
};

//Youn have to login to change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new password
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found!!",
      });
    }
    //check if the old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "old password is not correct.Please try again!!",
      });
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update  user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong!!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
};
