const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../../models/productModel");  
const Order = require("../../models/orderModel");     

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatbot = async (req, res) => {
  try {
    const { message, userId } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get products (limit 5 for context)
    const products = await Product.find().limit(5);

    // Get recent orders of the logged-in user
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // Context for AI
    const context = `
    You are an AI assistant for my e-commerce website.
    ✅ You can answer ONLY about products, orders, payments, shipping, and discounts.
    ❌ If user asks anything unrelated, respond with:
       "I can only help you with our e-commerce services."

    Here are some products in the store:
    ${products.map(p => `- ${p.name} (₹${p.price})`).join("\n")}

    Here are the user's last 3 orders:
    ${orders.length > 0 
        ? orders.map(o => `- Order ${o._id}: Status ${o.status}, Total ₹${o.total}`).join("\n")
        : "No recent orders found."
    }
    `;

    // Ask Gemini
    const result = await model.generateContent([context, message]);

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = chatbot;
