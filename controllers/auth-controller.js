const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");

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
    const hashedPassword = bcrypt.hash(password, salt);

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

module.exports = {
  registerUser,
};
