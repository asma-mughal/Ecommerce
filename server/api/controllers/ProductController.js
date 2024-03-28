import slugify from "slugify";
import { Product } from "../models/productModel.js";
import fs from "fs";
import { Category } from "../models/categoryModal.js";
import mongoose from "mongoose";
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, catgeory, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    if (
      !name ||
      !description ||
      !price ||
      !catgeory ||
      !quantity ||
      !shipping ||
      !photo
    ) {
      return res.status(401).json({ message: "All feilds are required" ,success: false });
    }
    if (!mongoose.Types.ObjectId.isValid(catgeory)) {
        return res.status(400).json({ message: "Invalid category ID", success: false });
      }
    const products = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    return res.status(200).json({ message: "Product is Saved", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Creation of Product",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Product is Saved", success: true, allProducts });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Retriving of Products",
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const uniqueProduct = await Product.find({ _id: id })
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "All Products", success: true, uniqueProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Retriving of Products",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const exsistingProduct = await Product.findOne({ _id: id });
    if (!exsistingProduct) {
      return res.status(500).json({ messge: "Product doesn't exsist",success: false });
    }
    const uniqueProduct = await Product.findByIdAndDelete({ _id: id }).select(
      "-photo"
    );

    return res
      .status(200)
      .json({ message: "Product is deleted", success: true, uniqueProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Retriving of Products",
    });
  }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, catgeory, quantity, shipping } =
          req.fields;
        const { photo } = req.files;
        const {id } = req.params
        if (
          !name ||
          !description ||
          !price ||
          !catgeory ||
          !quantity ||
          !shipping ||
          !photo
        ) {
          return res.status(401).json({ message: "All feilds are required" ,success: false });
        }
        if (!mongoose.Types.ObjectId.isValid(catgeory)) {
            return res.status(400).json({ message: "Invalid category ID", success: false });
          }
          const products =  await Product.findByIdAndUpdate(
            id,
            { ...req.fields, slug: slugify(name) },
            { new: true }
          );
          if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
          }
          await products.save();
          res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
          });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Error in Creation of Product",
        });
      }
}