const addToCartModel = require("../../models/cartProduct");

const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;              //  from auth middleware
    const productId = req.params.id;        //  cart item id in URL

    const deletedItem = await addToCartModel.findOneAndDelete({
      _id: productId,
      userId: userId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Cart item not found or unauthorized",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Item removed from cart",
      data: deletedItem,
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

module.exports = removeCartItem;
