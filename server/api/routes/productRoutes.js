import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import formidableMiddleware from 'express-formidable';
import { addProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controllers/ProductController.js';
const router = express.Router()
router.post('/add', formidableMiddleware(), addProduct)
router.get('/single/:id', getSingleProduct)
router.delete('/delete/:id', deleteProduct)
router.patch('/update/:id', formidableMiddleware(), updateProduct)
router.get('/',getAllProducts )
export default router;