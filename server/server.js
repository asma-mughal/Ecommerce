
import express from "express"
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import UserRoute from './routes/userRoutes.js';
import mongoose from "mongoose";
import { requireSignIn } from "./middleware/authMiddleware.js";
import { testController } from "./controllers/UserController.js";
dotenv.config()
const app = express()
app.use(express.json())
app.use('/auth',UserRoute)
app.use('/test' , requireSignIn, testController)
const PORT = 8000 

mongoose.connect("mongodb+srv://asmamughal097:UZDynR7zE9b5qTYm@cluster0.jlpafag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => app.listen(PORT, ()=> console.log("Server runing")))
    .catch(err => console.error("MongoDB connection error:", err));
    app.get('*',(req,res,next)=>{
        res.status(200).json({
          message:'Successfully'
        })
      })