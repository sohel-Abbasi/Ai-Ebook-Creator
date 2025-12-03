import express from "express";
const router = express.Router();
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
} from "../controller/bookController.js";

import { protect } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

// apply protect middleware to all routes in the file
router.use(protect);

router.route("/").post(createBook).get(getBooks);

router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);

router.route("/cover/:id").put(upload, updateBookCover);

export default router;
