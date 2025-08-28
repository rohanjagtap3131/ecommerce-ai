const mongoose = require("mongoose");

const productSchema =new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    brandName:{
        type:String,
        required:true
    },
   
    category:{
        type:String,
        required:true
    },
    productImage:{
        type:[],
        required:true
    },
    discreption:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true
    },
   

},{
    timestamps:true
});

const productModel = mongoose.model("product",productSchema);

module.exports = productModel;