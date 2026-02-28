const express = require("express");
const {
  getAllBooks,
  getSingleBookByID,
  addNewBook,
  updateSingleBook,
  deleteBook,
} = require("../controllers/book-controller");
const authenticateMiddleware = require("../middleware/auth-middleware");

//create express router
const router = express.Router();

//all routes that are related to books only
router.get("/", authenticateMiddleware, (req, res) => {
  const { username, email, userId, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to our Boostore app!",
    user: {
      _id: userId,
      username,
      email,
      role,
    },
  });
});
router.get("/get", getAllBooks);
router.get("/get/:id", getSingleBookByID);
router.post("/add", addNewBook);
router.put("/update/:id", updateSingleBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
