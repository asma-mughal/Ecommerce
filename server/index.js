import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { requireSignIn } from "./api/middleware/authMiddleware.js";
import { testController } from "./api/controllers/UserController.js";

import UserRoute from "./api/routes/userRoutes.js";
import CategoryRoute from "./api/routes/categoryRoutes.js";
import ProductRoute from './api/routes/productRoutes.js';
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the server!" });
});

app.use(bodyParser.json({ limit: "30MB", extended: true })); //for Images
app.use(bodyParser.urlencoded({ limit: "30MB", extended: true })); //for Images

const corsOptions = {
  origin: ["http://localhost:3000", "http://example.com"],
};

app.use(cors(corsOptions));

app.use("/auth", UserRoute);
app.use("/category", CategoryRoute);
app.use("/product", ProductRoute);
app.use("/test", requireSignIn, testController);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(
    "mongodb+srv://asmamughal097:UZDynR7zE9b5qTYm@cluster0.jlpafag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => app.listen(PORT, () => console.log(`Server Running at ${PORT}`)))
  .catch((err) => console.error("MongoDB connection error:", err));
