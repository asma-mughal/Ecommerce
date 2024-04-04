import slugify from "slugify";
import { Category } from "../models/categoryModal.js";
import mongoose from "mongoose";
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).json({ message: "Name is required" });
    }
    const exsistingCategory = await Category.findOne({ name });
    if (exsistingCategory) {
      return res.status(401).json({ message: "Name already exsist" });
    }
    const savedCategory = await new Category({
      name: name,
      slug: slugify(name),
    }).save();
    //console.log(savedCategory);
    return res
      .status(200)
      .json({ message: "Category is Saved", success: true, savedCategory });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in Category",
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return res.status(401).json({ message: "Name is required" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in Category",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find({});
    //console.log(allCategories);
    res.status(200).send({
      success: true,
      allCategories,
    });
  } catch (err) {
      console.log(err)
    res.status(500).json({
      success: false,
      message: "Error in Category",
    });
  }
};
export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(401).json({ message: "Id is required" });
      }
      const exsistingCategory = await Category.findOne({ _id: id });
    if (!exsistingCategory) {
      return res.status(401).json({ message: "Category doesn't exsist" });
    }
        const deletedVal = await Category.findByIdAndDelete({_id : id})
      res.status(200).send({
        success: true,
          messsage: "Category Deleted Successfully",
        deletedVal
      });
    } catch (err) {
        console.log(err)
      res.status(500).json({
        success: false,
        message: "Error in Category",
      });
    }
  };