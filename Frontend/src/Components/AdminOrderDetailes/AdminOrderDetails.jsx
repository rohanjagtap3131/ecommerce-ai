import { useEffect, useState } from "react";
import summuryAPI from "../../Common"; // adjust path if needed
import { toast } from "react-toastify";

export default function AdminOrderDetails() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(summuryAPI.adminOrders.url, {
                method: summuryAPI.adminOrders.method.toUpperCase(),
                credentials: "include", // important for cookies/JWT
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders || []);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Something went wrong while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(summuryAPI.updateOrderStatus(orderId).url, {
                method: summuryAPI.updateOrderStatus(orderId).method.toUpperCase(),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Order status updated");
                // update state without refetch
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Something went wrong while updating order");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <p className="text-center py-4">Loading orders...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Orders</h2>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full border border-gray-300 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Order ID</th>
                                <th className="px-4 py-2 border">Customer</th>
                                <th className="px-4 py-2 border">Items</th>
                                <th className="px-4 py-2 border">Total</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="text-center">
                                    <td className="px-4 py-2 border">{order._id}</td>
                                    <td className="px-4 py-2 border">{order.user?.name || "N/A"}</td>
                                    <td className="px-4 py-2 border">
                                        {order.items
                                            ?.map((item) => `${item.productName} x${item.quantity}`)
                                            .join(", ")}
                                    </td>
                                    <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                                    <td className="px-4 py-2 border font-semibold">
                                        {order.status}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="border rounded p-1"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
