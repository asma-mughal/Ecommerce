
// import express from "express"
// import dotenv from 'dotenv';
// import { connectDB } from "./api/config/db.js";
// import UserRoute from './routes/userRoutes.js';
// import mongoose from "mongoose";
// import { requireSignIn } from "./api/middleware/authMiddleware.js";
// import { testController } from "./controllers/UserController.js";
// dotenv.config()
// const app = express()
// app.use(express.json())
// app.use('/auth',UserRoute)
// app.use('/test', requireSignIn, testController)
// app.get('*',(req,res,next)=>{
//   res.status(200).json({
//     message:'Successfully'
//   })
// })
// const PORT = 8000 


// mongoose.connect("mongodb+srv://asmamughal097:UZDynR7zE9b5qTYm@cluster0.jlpafag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//     .then(() => app.listen(PORT, ()=> console.log("Server runing")))
//     .catch(err => console.error("MongoDB connection error:", err));
    

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { requireSignIn } from "./api/middleware/authMiddleware.js";
import { testController } from "./api/controllers/UserController.js";

import UserRoute from './api/routes/userRoutes.js';
const app = express()
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the server!' });
});

app.use(bodyParser.json({ limit: "30MB", extended: true })) //for Images
app.use(bodyParser.urlencoded({ limit: "30MB", extended: true })) //for Images
const corsOptions = {
  origin: ['http://localhost:3000', 'http://example.com']
};

app.use(cors(corsOptions))

app.use('/auth',UserRoute)
app.use('/test', requireSignIn, testController)
const PORT = process.env.PORT || 8080; 
mongoose.connect("mongodb+srv://asmamughal097:UZDynR7zE9b5qTYm@cluster0.jlpafag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => app.listen(PORT, ()=> console.log(`Server Running at ${PORT}`)))
    .catch(err => console.error("MongoDB connection error:", err));
