const express = require("express");
const orderModel = require("../../models/orderModel");

// ✅ Update tracking status
const updateAdminOrders = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // push new tracking step
    order.tracking.push({ status, updatedAt: new Date() });

    // also update current status field
    order.status = status;

    await order.save();

    res.json({
      success: true,
      message: "Order tracking updated",
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
};

module.exports = updateAdminOrders;
