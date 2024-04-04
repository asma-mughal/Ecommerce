import slugify from "slugify";
import { Product } from "../models/productModel.js";
import fs from "fs";
import mongoose from "mongoose";
import { Category } from "../models/categoryModal.js";
import braintree from "braintree";
import { Order } from "../models/orderModel.js";
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "cpzstv4xwcwsxn5t",
  publicKey: "xgxzr58hjbz3rm3h",
  privateKey: "2171dec631afc7d17fb8f4af3c1f5e45",
});


export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity   } = req.fields;
    const { photo } = req.files;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID", success: false });
    }

    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    } else {
      return res.status(400).json({ message: "Photo field is required", success: false });
    }

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in Creation of Product",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).lean()
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Products", success: true, allProducts });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Retriving of Products",
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const uniqueProduct = await Product.find({ _id: id }).lean()
      .select("-photo")
      .populate('category')
      .limit(12)
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "All Products", success: true, uniqueProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Retriving of Products",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const exsistingProduct = await Product.findOne({ _id: id });
    if (!exsistingProduct) {
      return res.status(500).json({ messge: "Product doesn't exsist",success: false });
    }
    const uniqueProduct = await Product.findByIdAndDelete({ _id: id }).select(
      "-photo"
    );

    return res
      .status(200)
      .json({ message: "Product is deleted", success: true, uniqueProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in Retriving of Products",
    });
  }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
          req.fields;
      const { photo } = req.files;
      console.log(name, description, price, category, quantity)
        const {id } = req.params
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Invalid category ID", success: false });
          }
          const products =  await Product.findByIdAndUpdate(
            id,
            { ...req.fields, slug: slugify(name) },
            { new: true }
          );
          if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
          }
          await products.save();
          return res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
          });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error in Creation of Product",
        });
      }
}
export const productPhotoController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};


export const productFilter = async(req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {}
    if (checked?.length > 0) args.category = checked;
    if (radio?.length ==2) args.price = { $gte: radio[0], $lte: radio[1] }
    const products = await Product.find(args).select("name price photo description").lean()
    return res.status(200).json({
      success: true,
      message: "All products are here",
      products
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success: "false",
      message :"error filtering the products"
    })

  }
}
export const productCount = async(req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount()
    return res.status(200).json({
      message: "Counted the products",
      success: true,
      total
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success: "false",
      message :"Error Counting the products"
    })

  }
}

export const productList = async(req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1
    const products = await Product.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({createdAt : -1}).lean()
    return res.status(200).json({
      message: "Counted the products",
      success: true,
      products
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success: "false",
      message :"Error retrieving the products"
    })

  }
}
export const searchProduct = async(req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        {name : {$regex : keyword, $options:'i'}}, //search a word and don't care about case sesnsitive
        {description : {$regex : keyword, $options : 'i'}}
      ]
    }).select("-photo").lean()
    return res.json(results)
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erorr while Searching",
      error,
    });
  }
}
export const relatedProduct = async(req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .populate('category')
      .limit(3)
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error, "Error at realted priodycts");
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
}
export const getProductByCat = async(req, res) => {
  try {
    //console.log( req.params.slug )
    const category = await Category.findOne({ slug: req.params.slug })
    //console.log(category)
    const product = await Product.find({ category }).lean()
    //console.log(product)
    res.status(200).send({
      success: true,
      category,
      product
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting products",
      error,
    });
  }
}
export const paymentBrainTreeToken = async(req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
export const paymentBrainTree = async(req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new Order({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}