const addToCartModel = require("../../models/cartProduct")

const countAddToCartComp = async (req, res) => {
    try {
        const currentUser = req.userId;
        const cartCount = await addToCartModel.countDocuments({userId:currentUser});

         res.status(200).json({
                message: "oK",
                data: {
                    cartCount:cartCount
                },
                success: true,
                error: false,
            });


    } catch (err) {

        res.status(500).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false
        })
    }
}

module.exports= countAddToCartComp;