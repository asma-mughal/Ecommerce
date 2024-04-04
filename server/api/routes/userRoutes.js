import express from 'express';
import { changeOrderStatus, forgotPasswordController, getAllOrders, getOrders, loginUser, registerUser, updateProfileController } from '../controllers/UserController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
const router = express.Router()


router.post('/forgotPassword', forgotPasswordController)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/update', updateProfileController)
router.get('/get-order/:id', getOrders)
router.get('/get-all-order', getAllOrders)
router.put('/status-update/:id',changeOrderStatus)
router.get('/admin-auth', requireSignIn,isAdmin,  (req, res) => {
    res.status(200).send({ok:true})
})

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok:true})
})



export default router;