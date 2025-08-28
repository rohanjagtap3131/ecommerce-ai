const productModel = require("../../models/productModel");
// adjust path as needed

const searchproduct = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({
        message: "Search query is required",
        error: true,
        success: false
      });
    }

    // Case-insensitive partial match on productName or category
    const products = await productModel.find({
      $or: [
        { productName: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { brandName: { $regex: searchQuery, $options: "i" } }
      ]
    });

    console.log("Search Query:", searchQuery);
    console.log("Found Products:", products);
    return res.json({
      data: products,
      message: "Products fetched successfully",
      error: false,
      success: true
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false
    });
  }
};

module.exports = searchproduct;
