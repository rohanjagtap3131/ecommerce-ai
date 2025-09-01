const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatbot = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "⚠️ Message is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- Product Search ---
    let searchResults = [];
    if (message.toLowerCase().includes("show") || message.toLowerCase().includes("find")) {
      const keyword = message.split(" ").slice(1).join(" ");
      if (keyword) {
        searchResults = await Product.find({
          $or: [
            { productName: new RegExp(keyword, "i") },
            { category: new RegExp(keyword, "i") }
          ]
        }).limit(5);
      }
    }

    // --- Order Tracking ---
    let orderInfo = "";
    if (message.toLowerCase().includes("track order") && userId) {
      const orderId = message.split(" ").pop();
      const order = await Order.findOne({ _id: orderId, userId });
      if (order) {
        orderInfo = `Order ${order._id} → Status: ${order.status}, Total: ₹${order.total}`;
      } else {
        orderInfo = "⚠️ Order not found.";
      }
    }

    // --- Last Order ---
    let lastOrderInfo = "";
    if (message.toLowerCase().includes("last order") && userId) {
      const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
      if (lastOrder) {
        lastOrderInfo = `Your last order ${lastOrder._id} is ${lastOrder.status}, Total ₹${lastOrder.total}`;
      } else {
        lastOrderInfo = "No recent orders found.";
      }
    }

    // --- Discounts ---
    let discounts = [];
    if (message.toLowerCase().includes("discount")) {
      discounts = await Product.find({ $expr: { $lt: ["$sellingPrice", "$price"] } }).limit(5);
    }

    // --- Build Context for Gemini ---
    const context = `
      You are an AI assistant for an e-commerce website.
      ✅ You can answer about products, orders, payments, shipping, and discounts.
      ❌ If question is unrelated, reply with:
         "I can only help you with our e-commerce services."

      ${searchResults.length ? `🔎 Search Results:\n${searchResults.map(p => `- ${p.productName} (₹${p.sellingPrice})`).join("\n")}` : ""}

      ${orderInfo ? `📦 Order Info: ${orderInfo}` : ""}

      ${lastOrderInfo ? `📦 Last Order: ${lastOrderInfo}` : ""}

      ${discounts.length ? `🔥 Discounts:\n${discounts.map(p => `- ${p.productName}: ₹${p.sellingPrice} (was ₹${p.price})`).join("\n")}` : ""}
    `;

    // --- Ask Gemini ---
    let reply = "⚠️ Sorry, I couldn't process your request.";
    try {
      const result = await model.generateContent([context, message]);
      reply = result?.response?.text()?.replace(/[*_`#>\[\]()]/g, "").trim() || reply;
    } catch (err) {
      console.error("❌ Gemini API error:", err.message);
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot Fatal Error:", error);
    res.status(500).json({ reply: "⚠️ Server error, please try again." });
  }
};

module.exports = chatbot;
