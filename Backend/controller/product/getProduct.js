const productModel = require("../../models/productModel");

const getProductControler = async (req, res) => {
    try {

    const allProduct = await productModel.find().sort({createdAt : -1});
    

        return res.status(200).json({
                message: "All Product",
                data: allProduct,
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

module.exports = getProductControler;