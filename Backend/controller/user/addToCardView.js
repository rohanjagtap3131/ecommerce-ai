const addToCartModel = require("../../models/cartProduct");

const addToCardView = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
        error: true
      });
    }

    const allProduct = await addToCartModel.find({ userId })
      .populate("productId"); // now works ✅

    return res.status(200).json({
      message: "All Product in Cart",
      data: allProduct,
      success: true,
      error: false,
    });

  } catch (err) {
    console.error("❌ Error in addToCardView:", err);
    return res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

module.exports = addToCardView;
