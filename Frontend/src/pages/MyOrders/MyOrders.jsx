import { useEffect, useState } from "react";
import summaryAPI from "../../Common";
import { toast } from "react-toastify";
import displayCurrency from "../../helper/displayCurrency";
import AiChatBot from "../../Components/AiChatBot/AiChatBot";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(summaryAPI.getOrders.url, {
        method: summaryAPI.getOrders.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (result.success && Array.isArray(result.orders)) {
        setOrders(result.orders);
      } else {
        setOrders([]);
        toast.error(result.message || "No orders found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const steps = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

  const getStepIcon = (step) => {
    switch (step) {
      case "Cancelled": return "❌";
      case "Pending": return "⏳";
      case "Paid": return "💳";
      case "Processing": return "⚙️";
      case "Shipped": return "🚚";
      case "Delivered": return "✅";
      default: return "⏺";
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`${summaryAPI.cancelOrders(orderId).url}`, {
        method: summaryAPI.cancelOrders(orderId).method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusIndex = steps.indexOf(order.status);

            return (
              <div key={order._id} className="bg-white shadow rounded-lg p-4 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2">
                  <span>🆔 Order ID: {order._id}</span>
                  <span>💳 Payment ID: {order.paymentId}</span>
                  <span>
                    📅{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.productImage?.[0] || "/no-image.png"}
                          alt={item.product?.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{item.product?.productName}</p>
                          <p className="text-sm text-gray-500">
                            {item.product?.brandName} • {item.product?.category}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-800">{displayCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center font-semibold mt-2">
                  <span>Total: {displayCurrency(order.totalAmount)}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Delivered"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Tracking Bar */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">📍 Order Tracking</h3>
                  <div className="relative w-full">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 rounded-full"></div>
                    <div
                      className="absolute top-5 left-0 h-1 rounded-full transition-all duration-500"
                      style={{
                        width: order.status === "Cancelled" ? "100%" : `${(statusIndex / (steps.length - 1)) * 100}%`,
                        backgroundColor: order.status === "Cancelled" ? "red" : "#16a34a",
                      }}
                    ></div>

                    <div className="flex justify-between items-center relative z-10">
                      {steps.map((step, index) => {
                        const isActive = index <= statusIndex || order.status === "Cancelled";

                        return (
                          <div key={index} className="flex flex-col items-center w-14">
                            <div
                              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                                isActive
                                  ? order.status === "Cancelled"
                                    ? "bg-red-600 border-red-600 text-white"
                                    : "bg-green-600 border-green-600 text-white"
                                  : "bg-white border-gray-300 text-gray-400"
                              }`}
                            >
                              {getStepIcon(step)}
                            </div>
                            <span className="mt-2 text-xs font-medium text-center text-gray-600">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
      <AiChatBot/>
    </div>
    
  );
}
