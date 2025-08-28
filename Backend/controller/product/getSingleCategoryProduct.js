const productModel = require("../../models/productModel");


const getCategeoryProduct = async (req, res) => {
    try {

        const productCategory = await productModel.distinct("category");

        console.log("Category ",productCategory)

        const productByCategory = [];

        for(const category of productCategory){
            const product = await productModel.findOne({category})

            if(product){
                productByCategory.push(product);
            }
        }

         return res.status(200).json({
                message: "category product",
                data: productByCategory,
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

module.exports = getCategeoryProduct;