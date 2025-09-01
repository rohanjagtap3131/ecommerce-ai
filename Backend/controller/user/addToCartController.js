const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId; // set by auth middleware

    // ✅ If not logged in
    if (!currentUser) {
      return res.status(401).json({
        message: "Please login to add products to cart",
        error: true,
        success: false,
        type: "auth",  // 👈 add a type field
      });
    }

    if (!productId) {
      return res.status(400).json({
        message: "ProductId is required",
        error: true,
        success: false,
        type: "validation",
      });
    }

    // ✅ Check if product already exists
    const existingCart = await addToCartModel.findOne({ productId, userId: currentUser });

    if (existingCart) {
      return res.status(400).json({
        message: "Product already in your cart",
        error: true,
        success: false,
        type: "duplicate",  // 👈 clear reason
      });
    }

    const payload = {
      productId,
      quantity: 1,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payload);
    const savedCart = await newAddToCart.save();

    return res.status(200).json({
      message: "Product added to Cart",
      data: savedCart,
      success: true,
      error: false,
      type: "success",
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
      type: "server",
    });
  }
};

module.exports = addToCartController;
