const orderModel = require("../../models/orderModel");

const adminOrdersDetails = async (req, res) => {
  try {
    const allOrders = await orderModel
      .find()
      .populate("items.product")          // full product details
      .populate("user", "name _id")       // only _id and name from user
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All orders",
      data: allOrders,
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

module.exports = adminOrdersDetails;
