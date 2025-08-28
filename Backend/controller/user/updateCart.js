const addToCartModel = require("../../models/cartProduct");

const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cartId = req.params.id;      // get _id from URL
    const qty = req.body.quantity;     // numeric quantity

    if (qty === undefined) {
      return res.status(400).json({
        message: "Quantity is required",
        success: false,
        error: true,
      });
    }

    // Update cart item for this user
    const updatedCart = await addToCartModel.findOneAndUpdate(
      { _id: cartId, userId },
      { quantity: qty },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Quantity updated",
      data: updatedCart,
      success: true,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = updateCart;
