import { useLocation, Link } from "react-router-dom";
import summuryAPI from "../../Common";
import { useEffect, useState, useContext } from "react";
import Context from "../../context";
import addToCart from "../../helper/addToCart";
import displayCurrency from "../../helper/displayCurrency";

export default function SearchProduct() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingList = new Array(8).fill(null);

  const { fetchCartCount } = useContext(Context);

  // Extract query param ?q=... or ?query=...
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("q") || searchParams.get("query");

  const fetchSearchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${summuryAPI.searchProduct.url}?q=${searchTerm}`,
        { method: summuryAPI.searchProduct.method }
      );
      const dataResponse = await response.json();
      setProducts(dataResponse.data || []);
    } catch (error) {
      console.error("Error fetching search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    try {
      const res = await addToCart(id);
      if (res?.success) {
        fetchCartCount?.();
      }
    } catch {
      console.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSearchProduct();
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 my-8">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold py-3 border-b border-gray-200 text-gray-800">
        Search Results for:{" "}
        <span className="text-blue-600 capitalize">{searchTerm}</span>
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="bg-slate-200 rounded-xl shadow animate-pulse flex flex-col"
              >
                <div className="h-40 md:h-52 bg-gray-300 rounded-t-xl"></div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded mt-3 w-full"></div>
                </div>
              </div>
            ))
          : products.length === 0
          ? (
            <p className="text-gray-500 text-lg col-span-full">
              No products found
            </p>
          )
          : products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col border border-gray-100"
              >
                {/* Image Section */}
                <Link
                  to={`/product/${product._id}`}
                  className="bg-gray-50 h-40 md:h-52 p-3 flex items-center justify-center rounded-t-xl overflow-hidden"
                >
                  <img
                    src={product.productImage?.[0]}
                    alt={product.productName}
                    className="h-full w-full object-contain rounded-lg transition-transform duration-300 hover:scale-110"
                  />
                </Link>

                {/* Details + Button */}
                <div className="flex flex-col justify-between p-3 flex-1">
                  <div>
                    <Link to={`/product/${product._id}`}>
                      <h2 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-1 text-gray-800">
                        {product.productName}
                      </h2>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-500 italic capitalize mt-1">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <p className="text-red-600 font-semibold text-sm sm:text-base md:text-lg">
                        {displayCurrency(product.sellingPrice || product.price)}
                      </p>
                      {product.sellingPrice && (
                        <p className="line-through text-slate-500 text-xs sm:text-sm md:text-base">
                          {displayCurrency(product.price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="mt-3 bg-yellow-600 text-white text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-yellow-700 active:scale-95 transition-transform duration-200 w-full"
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
