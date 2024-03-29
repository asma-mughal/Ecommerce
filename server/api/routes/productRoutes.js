import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidableMiddleware from "express-formidable";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  productCount,
  productFilter,
  productList,
  productPhotoController,
  searchProduct,
  updateProduct,
} from "../controllers/ProductController.js";
const router = express.Router();
router.post("/add", formidableMiddleware(), addProduct);
router.get("/single/:id", getSingleProduct);
router.delete("/delete/:id", deleteProduct);
router.patch("/update/:id", formidableMiddleware(), updateProduct);
router.get("/product-photo/:id", productPhotoController);
router.get("/", getAllProducts);
router.post("/product-filter", productFilter);
router.get("/product-count", productCount);
router.get("/product-list/:page", productList)
router.get("/search/:keyword",searchProduct )
export default router;
