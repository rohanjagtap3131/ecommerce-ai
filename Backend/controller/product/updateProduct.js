const productModel = require("../../models/productModel")
const permission = require("../../helper/permission");
const updateProduct = async (req, res) => {
    try {
        const isAllowed = await permission(req.userId);
        if (!isAllowed) {
            throw new Error("Permission denied");
        }

        const id = req.params.id;
        const { productName, brandName, category, productImage, discreption, price, sellingPrice } = req.body;

        const payload = {
            ...(productName && { productName }),
            ...(brandName && { brandName }),
            ...(category && { category }),
            ...(productImage && { productImage }),
            ...(discreption && { discreption }),
            ...(price && { price: Number(price) }),
            ...(sellingPrice && { sellingPrice: Number(sellingPrice) }),
        };

        const editProduct = await productModel.findByIdAndUpdate(id, payload, {
            new: true
        });


        return res.status(200).json({
            message: "product Updated",
            data: editProduct,
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

module.exports = updateProduct;