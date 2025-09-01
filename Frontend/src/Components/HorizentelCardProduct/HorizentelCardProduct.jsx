import { useEffect, useState, useContext } from "react";
import fetchCategoryWiseProducts from "../../helper/fetchCategoryWiseProducts";
import displayCurrency from "../../helper/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../../helper/addToCart";
import Context from "../../context";
import { toast } from "react-toastify";

export default function HorizentelCardProduct({ category, heading }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingList = new Array(6).fill(null);

  const context = useContext(Context);
  const fetchCartCount = context?.fetchCartCount;

  const handelAddTOCard = async (e, id) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await addToCart(id);

      if (res?.success) {
        fetchCartCount?.();
       
      } else if (res?.error) {
        // check the type we added in backend
        if (res.type === "duplicate") {
          toast.error(res.message, { toastId: "already-in-cart" });
        } else if (res.type === "auth") {
          toast.error(res.message, { toastId: "login-required" });
        } else {
          toast.error(res.message || "Something went wrong", { toastId: "other-error" });
        }
      }
    } catch {
      toast.error("Server error, try again later", { toastId: "catch-error" });
    } finally {
      setLoading(false);
    }
  };



  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryProduct = await fetchCategoryWiseProducts(category);
      setData(categoryProduct?.data || []);
    } catch (err) {
      console.error("Failed fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="container mx-auto px-4 my-10">
      {/* Heading */}
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold py-3 border-b border-gray-200 text-gray-800 tracking-wide">
        {heading}
      </h1>

      {/* Product List */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar py-6 mt-4">
        {loading
          ? loadingList.map((_, index) => (
            <div
              key={index}
              className="min-w-[230px] sm:min-w-[250px] md:min-w-[280px] bg-slate-200 rounded-xl shadow animate-pulse"
            >
              <div className="h-44 md:h-52 bg-gray-300 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="flex gap-2 mt-3">
                  <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-9 bg-gray-300 rounded mt-4 w-full"></div>
              </div>
            </div>
          ))
          : data.map((product, index) => (
            <div
              key={product._id || index}
              className="min-w-[230px] sm:min-w-[250px] md:min-w-[280px] bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <Link
                to={`product/${product._id}`}
                className="bg-gray-50 h-44 md:h-52 p-3 flex items-center justify-center rounded-t-xl overflow-hidden"
              >
                <img
                  src={product.productImage?.[0]}
                  alt={product.productName}
                  className="h-full w-full object-contain transition-transform duration-300 hover:scale-110"
                />
              </Link>

              {/* Details */}
              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  <Link to={`/product/${product._id}`}>
                    <h2 className="font-semibold text-sm sm:text-base md:text-base text-gray-800 line-clamp-1">
                      {product.productName}
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-500 italic capitalize mt-1">
                    {product.category}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <p className="text-red-600 font-semibold text-sm sm:text-base md:text-base">
                    {displayCurrency(product.sellingPrice)}
                  </p>
                  <p className="line-through text-slate-500 text-xs sm:text-sm">
                    {displayCurrency(product.price)}
                  </p>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={(e) => handelAddTOCard(e, product._id)}
                  className="mt-4 bg-yellow-600 text-white text-sm sm:text-base font-medium px-5 py-2 rounded-lg hover:bg-yellow-700 active:scale-95 transition-all duration-200 w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
