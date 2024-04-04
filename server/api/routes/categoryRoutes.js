import express from 'express';
import { addCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/CategoryController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
const router = express.Router()
router.post('/add', requireSignIn,  addCategory)

router.patch('/update/:id', requireSignIn,  updateCategory)

router.get('/', getAllCategory)
router.delete('/delete/:id', requireSignIn, isAdmin,  deleteCategory)
export default router;