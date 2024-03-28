import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    question: {
        type: String,
       required:true 
    },
    phone: {
        type: String,
    required:true    
    },
    address: {
        type: String,
        required:true
    },
    role: {
        type: Number,
        default:0
    }
},{timestamps:true}
)
export const User = mongoose.model('userEcommerce', userSchema);
