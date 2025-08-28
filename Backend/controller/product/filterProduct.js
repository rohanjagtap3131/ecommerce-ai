const productModel = require("../../models/productModel");

const filterProduct = async (req , res) =>{
    try{
        const  categoryList = req.body.category || [];;
         const product = await productModel.find({
            category : {
                    "$in" : categoryList
                }
            
         });

         return res.status(200).json({
            message: `products`,
            data: product,
            success: true,
            error: false,
        });

    }catch(err){
        return res.status(500).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

module.exports = filterProduct;
