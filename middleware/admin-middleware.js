const isAdminUser = async (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin only allowed!",
    });
  }
  next();
};

module.exports = isAdminUser;
