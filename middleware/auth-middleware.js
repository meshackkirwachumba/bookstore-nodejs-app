const jwt = require("jsonwebtoken");

const authenticateMiddleware = async (req, res, nextFnc) => {
  console.log("AM BEING CALLED!!");

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied.No token provided",
    });
  }

  //decode this token to get user info
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    //add to the request
    req.userInfo = decodedTokenInfo;

    nextFnc();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied",
    });
  }
};

module.exports = authenticateMiddleware;
