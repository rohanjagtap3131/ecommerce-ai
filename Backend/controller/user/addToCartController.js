const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;   // ✅ use req.userId from middleware

    if (!productId) {
      return res.status(400).json({
        message: "ProductId is required",
        error: true,
        success: false,
      });
    }

    // Check for this product in this user's cart
    const existingCart = await addToCartModel.findOne({ productId, userId: currentUser });

    if (existingCart) {
      return res.status(400).json({
        message: "Product already in your cart",
        error: true,
        success: false,
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
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartController;
