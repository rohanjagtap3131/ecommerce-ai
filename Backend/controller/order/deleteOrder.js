const orderModel = require("../../models/orderModel");


const deleteOrder = async(req , res)=>{
    try {
    const { id } = req.params;

    const deletedItem = await orderModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.json({
      success: true,
      message: "Cart item deleted successfully",
      deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports = deleteOrder;