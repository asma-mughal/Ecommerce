

import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import { Order } from '../models/orderModel.js';
import { User } from '../models/userModal.js';
import JWT from 'jsonwebtoken';
export const registerUser = async (req, res) => {
    const { name, email, password, address, phone , question} = req.body;
    try {
      if (!name || !email || !password || !address || !phone || !question) {
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
        question
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
              _id: foundUser?._id,
              name: foundUser?.name,
              email: foundUser?.email,
              phone: foundUser?.phone,
              adddress: foundUser?.address,
              role: foundUser?.role,
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
export const forgotPasswordController = async(req, res) => {
  const { email, newpassword } = req.body;
  //console.log(req.body)
  
  try {
    if (!email || !newpassword)
        {
            return res.status(404).json({message : "Email and password is required"})
        }
    const user = User.findOne({ email })
    if (!user) {
      res.status(400).json({message : "User Not Found"})
    }
    const hashedPassword = await hashPassword(newpassword);
    const updatedUser = await User.findByIdAndUpdate(user?._id, { password: hashedPassword })
    res.status(200).json({
      message: "Password Reset succesfully",
      success: true
    })
  } catch (err)
  {
    console.log("Error", err)
    //console.log(err)
  }
}
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone, id } = req.body;
    const user = await User.findById(id);
    if (!user)
    {
      return res.status(404).json({message :"User not found" })
    }
    if (!password)
    {
      return res.json({message : 'Password is required'})
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name || user?.name,
        password: hashedPassword || user?.password,
        phone: phone || user?.phone,
        address: address || user?.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error)
  {
    console.log(error)
    return res.status(400).json({ message: "An error occurred while updating user" });
  }
}
export const getOrders = async(req,res) => {
  try {
      //req.params.id
      const orders = await Order
      .find({ buyer: req.params.id })
      .populate("products", "-photo")
        .populate("buyer", "name");
    
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
}
export const getAllOrders = async(req,res) => {
  try {
    const orders = await Order
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .lean()
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
}
export const changeOrderStatus = async(req,res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orders = await Order.findByIdAndUpdate(id, { status })
    res.json(orders)
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Updating Orders",
        error,
      });
    }
}