import Book from "../models/Book.js";
import path from "path";

// @desc create a new book
// @route POST/api/books
// @access Private

const createBook = async (req, res) => {
  try {
    const { title, author, subtitle, chapters } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "please provide a title and author" });
    }
    const book = await Book.create({
      userId: req.user._id,
      title,
      author,
      subtitle,
      chapters,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc  Get all books for a user
// @route GET /api/books
// @access Private

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc Get a single book by id
// @route GET /api/books/:id
// @access Private

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this book" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc update a book
// @route PUT /api/books/:id
// @access Private

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this book" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBook, { message: "book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc Delete a book
// @route DELETE /api/books/:id
// @access Private

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to Delete this book" });
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc update a books cover image
// @route PUT /api/books/cover/:id
// @access Private

const updateBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to Update this book" });
    }

    if (req.file) {
      // Normalize path to use forward slashes for URLs
      book.coverImage = `/${req.file.path.replace(/\\/g, "/")}`;
    } else {
      return res.status(400).json({ message: "No image file provided" });
    }
    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
};
