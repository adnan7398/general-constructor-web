import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/adminroutes.js"; // Note: Use `.js` extension
import projectRoutes from "./routes/projectroutes.js";
import TeamRouter from "./routes/teammember.js";
import accountRoutes from "./routes/account.js"; // Assuming you have a route for site accounts
import resourcesrouter from './routes/resources.js';

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
 'https://general-constructor-web-hu2p.vercel.app',

];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/project", projectRoutes);
app.use("/team",TeamRouter);
app.use("/account",accountRoutes);
app.use('/resources', resourcesrouter);

const PORT = process.env.PORT || 3000;
console.log(`MongoDB URL : ${process.env.MONGO_URL}`);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
