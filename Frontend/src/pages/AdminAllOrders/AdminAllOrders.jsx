import { useEffect, useState } from "react";
import summuryAPI from "../../Common";
import { toast } from "react-toastify";
import displayCurrency from "../../helper/displayCurrency";

export default function AdminAllOrders() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(summuryAPI.getAllOrders.url, {
        method: summuryAPI.getAllOrders.method,
        credentials: "include",
      });
      const data = await res.json();
      console.log("DATA :", data);
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Update order tracking
  const updateTracking = async (orderId, newStatus) => {
    try {
      const res = await fetch(summuryAPI.updateOrders(orderId).url, {
        method: summuryAPI.updateOrders(orderId).method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Tracking updated ✅");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to update tracking");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete order (Admin only)
  const handleDeleteOrder = async (orderId) => {
    try {
      if (!window.confirm("Are you sure you want to permanently delete this order?")) return;

      const res = await fetch(summuryAPI.deleteOrders(orderId).url, {
        method: summuryAPI.deleteOrders(orderId).method,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted successfully ✅");
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error(data.message || "Failed to delete order ❌");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        📦 All Orders
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-10 bg-gray-50 rounded-xl">
            No orders found
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="p-5 border rounded-2xl shadow-sm bg-white hover:shadow-lg transition duration-200"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
              <h2 className="font-semibold text-base sm:text-lg text-gray-700 break-words">
                Order ID: <span className="text-gray-600">{order.orderId}</span>
              </h2>
              <span
                className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium w-fit ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Delivered"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* User & Amount */}
            <div className="space-y-1 mb-3">
              <p className="text-sm text-gray-700">
                <strong>User:</strong> {order.user?.name}{" "}
                <span className="text-gray-500">(ID: {order.user?._id})</span>
              </p>
              <p className="text-sm text-gray-700">
                <strong>Total Amount:</strong>{" "}
                <span className="text-black font-semibold">
                  {displayCurrency(order.totalAmount)}
                </span>
              </p>
            </div>

            {/* Items */}
            <h3 className="font-medium mb-2 text-gray-800">🛍️ Items</h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50"
                >
                  <img
                    src={item.product?.productImage?.[0] || "/no-image.png"}
                    alt={item.product?.productName}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">
                      {item.product?.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Brand: {item.product?.brandName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: {displayCurrency(item.product?.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking History */}
            {order.tracking?.length > 0 && (
              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">
                  📍 Tracking History
                </h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  {order.tracking.map((t, i) => (
                    <li key={i}>
                      <span className="font-medium">{t.status}</span> -{" "}
                      {new Date(t.updatedAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Update Tracking Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {["Processing", "Shipped", "Delivered", "Cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => updateTracking(order._id, status)}
                    className="px-3 py-1 text-xs sm:text-sm rounded-lg border bg-gray-100 hover:bg-gray-200"
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteOrder(order._id)}
              className="mt-3 w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              🗑️ Delete Order
            </button>

            {/* Footer */}
            <p className="text-xs text-gray-500 mt-4 border-t pt-2">
              Ordered on:{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
