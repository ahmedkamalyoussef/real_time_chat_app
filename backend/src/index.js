import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendshipRoutes from "./routes/friends.route.js";
import groupRoutes from "./routes/group.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 5001;

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/friends", friendshipRoutes);
app.use("/api/v1/groups", groupRoutes);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../../frontend/dist");
  const indexPath = path.join(staticPath, "index.html");

  console.log("Static files path:", staticPath);
  console.log("Index file path:", indexPath);

  // Check if frontend build exists
  try {
    const fs = await import("fs");
    if (!fs.existsSync(staticPath)) {
      console.error("Frontend build not found at:", staticPath);
      console.error("Please run: npm run build in the frontend directory");
      process.exit(1);
    }
    if (!fs.existsSync(indexPath)) {
      console.error("Index.html not found at:", indexPath);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error checking frontend build:", error);
    process.exit(1);
  }

  // Serve static files from the React build folder
  app.use(express.static(staticPath));

  // Catch-all handler: send back React's index.html file for any non-API routes
  app.get("*", (req, res) => {
    console.log("Serving index.html for route:", req.path);
    res.sendFile(indexPath);
  });
}
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
