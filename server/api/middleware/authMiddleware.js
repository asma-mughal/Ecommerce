import JWT from "jsonwebtoken"
import { User } from '../models/userModal.js';
export const requireSignIn =  (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, 'test')
        req.user = decode;
        next()
    } catch (err)
    {
        console.log(`error something in Middleware ${err}` )
    }
}
export const isAdmin = async(req, res, next) => {
    try {
        const user = await User.findById(req?.user._id)
        if (user.role !== 1)
        {
            return res.status(401).json({message : "Unauthorized Access"})
        }
        else {
            next()
        }
    } catch (err)
    {
        console.log("Error middleware Admin")
    }
}