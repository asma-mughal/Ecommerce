

import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import { User } from '../models/userModal.js';
import JWT from 'jsonwebtoken';
export const registerUser = async (req, res) => {
    const { name, email, password, address, phone } = req.body;
    try {
      if (!name || !email || !password || !address || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }
        const exsistingUser = await User.findOne({ email })
        if (exsistingUser) {
            return res.status(200).json({message : "User exsist"})
        }
        const hashedPassword = await hashPassword(password);
        
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        address,
        phone,
      });
      await newUser.save();
        return res.status(201).json({
            message: "User created successfully", user: {
                name: newUser.name,
                email: newUser.email,
                address: newUser.password,
                phone : newUser.phone
      } });
    } catch (err) {
      console.error("Error registering user:", err);
      return res.status(500).json({ message: "An error occurred while registering user" });
    }
  };
  
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password)
        {
            return res.status(404).json({message : "Email or password required"})
        }
        const foundUser = await User.findOne({ email })
        if (!foundUser)
        {
            return res.status(400).json({message : "User doesn't found"})
        }
        const correctPassword = await comparePassword(password, foundUser.password)
        if (!correctPassword)
        {
         return res.status(200).json({message : "Password doesn't match"})   
        }
        const token = JWT.sign({ _id: foundUser?.id }, "test", {
            expiresIn:"4d"
        })
        
        return res.status(201).json({
            message: "User LoggedIn successfully", user: {
                name: foundUser?.name,
                email : foundUser?.email
      }, token  });
            
    } catch (err)
    {
        console.log(err)
    }
}
export const testController = (req, res) => {
    try {
      res.send("Protected Routes");
    } catch (error) {
      console.log(error);
      res.send({ error });
    }
  };
