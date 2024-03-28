import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase:true,
    }
})
export const Category = mongoose.model('categoryEcommerce', categorySchema);