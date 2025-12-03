import express from "express";

const router = express.Router();

import {
  exportAsPDF,
  exportAsDocument,
} from "../controller/exportController.js";

import { protect } from "../middlewares/authMiddleware.js";

router.get("/:id/pdf", protect, exportAsPDF);
router.get("/:id/doc", protect, exportAsDocument);

export default router;
