const Book = require("../models/book");

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find({});
    if (allBooks?.length > 0) {
      res.status(200).json({
        success: true,
        message: "list of books fetched successfully",
        data: allBooks,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no books found in collection",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const getSingleBookByID = async (req, res) => {
  try {
    const currentBookID = req.params.id;
    const bookDetails = await Book.findById(currentBookID);

    if (!bookDetails) {
      return res.status(404).json({
        success: false,
        message: "Book with that id is not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "book found successfully",
      data: bookDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const addNewBook = async (req, res) => {
  try {
    const newBookFormData = req.body;
    const newlyCreatedBook = await Book.create(newBookFormData);
    if (newlyCreatedBook) {
      res.status(201).json({
        success: true,
        message: "book added successfully",
        data: newlyCreatedBook,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const updateSingleBook = async (req, res) => {
  try {
    const bookID = req.params.id;
    const bookToUpdateFormData = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      bookID,
      bookToUpdateFormData,
      { new: true },
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "book not found with that id",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookID = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookID);
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "book not found with that id",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBooks,
  getSingleBookByID,
  addNewBook,
  updateSingleBook,
  deleteBook,
};
