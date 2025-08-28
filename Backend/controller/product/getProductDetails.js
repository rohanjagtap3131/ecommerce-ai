const productModel = require("../../models/productModel");

const getProductDetails = async (req, res) => {
    try {
        const {productId} = req.body

        if(!productId){
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        const product = await productModel.findById(productId);

        return res.status(200).json({
                message: `${product.productName} details`,
                data: product || {},
                success: true,
                error: false,
            });



    } catch (err) {
        return res.status(500).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

module.exports = getProductDetails;