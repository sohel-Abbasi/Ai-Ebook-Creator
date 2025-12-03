import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// connect database
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle text/plain requests as JSON
app.use((req, res, next) => {
  if (req.headers["content-type"] === "text/plain" && req.method !== "GET") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        req.body = JSON.parse(body);
      } catch (error) {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

// static folder for uploads
app.use("/Backend/uploads", express.static(path.join(__dirname, "uploads")));

// All routes here
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/export", exportRoutes);

app.get("/", (req, res) => {
  res.send("Backend of Ebook ai web app");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} `);
});
