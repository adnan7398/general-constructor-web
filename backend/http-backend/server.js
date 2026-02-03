import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import adminRoutes from "./routes/adminroutes.js";
import projectRoutes from "./routes/projectroutes.js";
import heroRoutes from "./routes/heroroutes.js";
import testimonialRoutes from "./routes/testimonialroutes.js";
import messageRoutes from "./routes/messageroutes.js";
import TeamRouter from "./routes/teammember.js";
import accountRoutes from "./routes/account.js";
import resourcesrouter from "./routes/resources.js";
import profileRoutes from "./routes/profile.js";
import settingsRoutes from "./routes/settings.js";
import quotesRoutes from "./routes/quotes.js";
import reportRoutes from "./routes/reports.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import directoryRoutes from "./routes/directoryStore.js";

const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* routes */
app.use("/admin", adminRoutes);
app.use("/project", projectRoutes);
app.use("/hero", heroRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/messages", messageRoutes);
app.use("/team", TeamRouter);
app.use("/account", accountRoutes);
app.use("/resources", resourcesrouter);
app.use("/profile", profileRoutes);
app.use("/settings", settingsRoutes);
app.use("/quotes", quotesRoutes);
app.use("/reports", reportRoutes);
app.use("/directory", directoryRoutes);
app.use("/analytics", analyticsRoutes);

/* port */
const PORT = process.env.PORT || 3000;

/* mongodb */
console.log("MongoDB URL:", process.env.MONGO_URI);
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

/* server */
// Bind server to localhost only to avoid exposing on network interfaces
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
