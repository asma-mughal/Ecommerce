import express from 'express';
import { forgotPasswordController, loginUser, registerUser, updateProfileController } from '../controllers/UserController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
const router = express.Router()


router.post('/forgotPassword', forgotPasswordController)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/update', updateProfileController)
router.get('/admin-auth', requireSignIn,isAdmin,  (req, res) => {
    res.status(200).send({ok:true})
})

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok:true})
})



export default router;