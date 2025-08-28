const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      Quantity: Number,
      price: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  tracking: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
    }
  ],
  paymentId: { type: String },
  orderId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
