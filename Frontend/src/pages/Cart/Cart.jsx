import { useState, useEffect, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

import Context from "../../context";
import summuryAPI from "../../Common";
import displayCurrency from "../../helper/displayCurrency";
import AiChatBot from "../../Components/AiChatBot/AiChatBot";

export default function Cart() {
  const [data, setData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const { fetchCartCount } = useContext(Context);

  /* ======================
     FETCH CART ITEMS
  ====================== */
  const fetchCartData = async () => {
    try {
      setPageLoading(true);
      const res = await fetch(summuryAPI.viewCart.url, {
        method: summuryAPI.viewCart.method,
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) setData(result.data || []);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      toast.error("Failed to load cart");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  /* ======================
     UPDATE QUANTITY
  ====================== */
  const updateQuantity = async (id, qty) => {
    if (qty < 1 || actionLoadingId === id) return;

    setActionLoadingId(id);

    try {
      const res = await fetch(summuryAPI.viewCartUpdate(id).url, {
        method: summuryAPI.viewCartUpdate(id).method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });

      const result = await res.json();
      if (result.success) {
        fetchCartData();
        fetchCartCount?.();
      }
    } catch (err) {
      console.error("Update Quantity Error:", err);
      toast.error("Failed to update quantity");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ======================
     DELETE ITEM
  ====================== */
  const deleteItem = async (id) => {
    if (actionLoadingId === id) return;

    setActionLoadingId(id);

    try {
      const res = await fetch(summuryAPI.viewCartDelete(id).url, {
        method: summuryAPI.viewCartDelete(id).method,
        credentials: "include",
      });

      const result = await res.json();
      if (result.success) {
        fetchCartData();
        fetchCartCount?.();
        toast.success("Item removed");
      }
    } catch (err) {
      console.error("Delete Item Error:", err);
      toast.error("Failed to remove item");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ======================
     TOTAL CALCULATION
  ====================== */
  const totalAmount = data.reduce((acc, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.productId?.sellingPrice) || 0;
    return acc + qty * price;
  }, 0);

  /* ======================
     PLACE ORDER (RAZORPAY)
  ====================== */
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch(summuryAPI.createOrder.url, {
        method: summuryAPI.createOrder.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ totalAmount }),
      });

      const { order } = await res.json();
      if (!order) return toast.error("Failed to create order");

      const options = {
        key:
          import.meta.env?.VITE_RAZORPAY_KEY_ID ||
          process.env.REACT_APP_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        name: "My Shop",
        order_id: order.id,

        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              summuryAPI.verifyPayment.url,
              {
                method: summuryAPI.verifyPayment.method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  cartItems: data,
                  totalAmount,
                }),
              }
            );

            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              toast.success("Order placed successfully");
              fetchCartData();
              fetchCartCount?.();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verify Payment Error:", err);
            toast.error("Payment verification error");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Something went wrong");
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {pageLoading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const qty = Number(item.quantity) || 1;
            const product = item.productId || {};
            const price = Number(product.sellingPrice) || 0;

            return (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.productImage?.[0] || "/placeholder.png"}
                    alt={product.productName || "Product"}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {product.productName || "Unknown Product"}
                    </h3>
                    <p className="text-gray-600">
                      {displayCurrency(price)}
                    </p>

                    <div className="flex items-center mt-2">
                      <button
                        className="px-2 py-1 border rounded"
                        disabled={actionLoadingId === item._id}
                        onClick={() =>
                          updateQuantity(item._id, qty - 1)
                        }
                      >
                        -
                      </button>

                      <span className="px-4">{qty}</span>

                      <button
                        className="px-2 py-1 border rounded"
                        disabled={actionLoadingId === item._id}
                        onClick={() =>
                          updateQuantity(item._id, qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <button
                    className="text-red-500"
                    disabled={actionLoadingId === item._id}
                    onClick={() => deleteItem(item._id)}
                  >
                    <MdDelete size={24} />
                  </button>

                  <p className="mt-2 font-bold">
                    {displayCurrency(qty * price)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* ORDER SUMMARY */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Order Summary</h3>

            <p className="flex justify-between">
              <span>Total Items:</span>
              <span>
                {data.reduce(
                  (acc, item) => acc + (Number(item.quantity) || 1),
                  0
                )}
              </span>
            </p>

            <p className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>{displayCurrency(totalAmount)}</span>
            </p>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      <AiChatBot />
    </div>
  );
}
