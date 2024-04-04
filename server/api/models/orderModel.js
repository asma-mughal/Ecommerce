import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    products: [
        {
            type: mongoose.ObjectId,
            ref:"productEcommerce"
        }
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref:"userEcommerce"
    },
    status: {
        type: String, 
        default: "Not Process",
        enum:["Not Process", "Processing" , "Shipped", "deliverd", "cancel"]
    }
}, {timestamps : true})
export const Order = mongoose.model('orderEcommerce', orderSchema);