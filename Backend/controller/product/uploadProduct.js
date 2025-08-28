const productModel = require("../../models/productModel");
const permission = require("../../helper/permission");
const uploadProductControler = async (req, res) => {
    try {

        const sessionUserId = req.userId;

        

    
        if (!permission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        const uploadProduct = new productModel(req.body)

        const saveProduct = await uploadProduct.save();

        if (!saveProduct) {
            return res.status(404).json({ message: "product not found" });
        }

        res.status(200).json({
            message: "product save",
            data: saveProduct,
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

module.exports = uploadProductControler;