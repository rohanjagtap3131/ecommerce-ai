const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/orderModel");
const Cart = require("../../models/cartProduct");

// ✅ 1. Create Razorpay order
const createOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    console.log("🟢 Creating Razorpay order for:", totalAmount);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("Using Key ID:", process.env.RAZORPAY_KEY_ID);

    const options = {
      amount: Math.round(totalAmount * 100), // integer
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create order" });
  }
};


// ✅ 2. Verify Payment & Save Order in DB
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, totalAmount } = req.body;
    const userId = req.userId;

    // Verify signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Save order in DB
    const order = new Order({
      user: userId,
      items: cartItems.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.productId.sellingPrice,
      })),
      totalAmount,
      status: "Paid",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    await order.save();

    // ✅ Fix: clear cart by user field
    await Cart.deleteMany({ user: userId });

    res.json({ success: true, message: "Payment verified & Order placed", order });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
// ✅ 3. Get Logged-in User Orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId }).populate("items.product");

    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};


module.exports = { createOrder, verifyPayment, getMyOrders };
