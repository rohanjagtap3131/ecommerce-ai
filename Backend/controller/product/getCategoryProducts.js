const productModel = require("../../models/productModel");

const getCategoryProducts = async (req, res) => {
    try {
        const { category } = req?.body;
        const product = await productModel.find({ category });

        return res.status(200).json({
            message: `${category} products`,
            data: product,
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

module.exports = getCategoryProducts;