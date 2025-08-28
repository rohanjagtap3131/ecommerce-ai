import summuryAPI from "../../Common";
import { useState, useEffect,useContext } from "react";
import { useNavigate , useParams } from "react-router-dom";
import { IoStar, IoStarHalf } from "react-icons/io5";
import VerticalCardProduct from "../../Components/VerticalCardProduct/VerticalCardProduct";
import addToCart from "../../helper/addToCart";
import Context from "../../context";
import { toast } from "react-toastify"; 
import AiChatBot from "../../Components/AiChatBot/AiChatBot";

export default function ProductDetails() {
  const [product, setProduct] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    discreption: "",
    price: "",
    sellingPrice: "",
  });
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // zoom
  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  // Quantity state
  

  const context = useContext(Context);
  const fetchCartCount = context?.fetchCartCount;


  const params = useParams();

  const fatchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(summuryAPI.productDetails.url, {
      method: summuryAPI.productDetails.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: params?.id }),
    });
    setLoading(false);
    const dataResponse = await response.json();
    setProduct(dataResponse?.data);
    console.log("Product Details", dataResponse?.data);
  };

const handelAddTOCard = async (e, id) => {
  e.preventDefault();
  try {
    const res = await addToCart(id);

    if (res?.success) {
      fetchCartCount?.();
    } else {
      toast.error("⚠️ Please login to add products to cart", { position: "top-right" });
    }
  } catch {
    toast.error("Something went wrong, try again later", { position: "top-right" });
  }
};


  useEffect(() => {
    fatchProductDetails();
  }, [params?.id]);

  useEffect(() => {
    if (product?.productImage?.length > 0) {
      setActiveImage(product.productImage[0]);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${activeImage || product?.productImage?.[0]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "200%", // zoom level
      width: "500px",
      height: "500px",
    });
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-lg font-medium text-gray-600 animate-pulse">
        Loading product details...
      </p>
    );
  }

  const handelByeProduct = async(e,id) =>{
    e.preventDefault();
    try {
      const res = await addToCart(id);
      if (res?.success) {
        navigate("/Cart");
        fetchCartCount?.()

      }else {
      toast.error("⚠️ Please login to add products to cart", { position: "top-right" });
    }
  } catch {
    toast.error("Something went wrong, try again later", { position: "top-right" });
  }
  }

  return (
    <div className="container mx-auto px-4 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images Section */}
          <div className="flex flex-col md:flex-row gap-6 relative">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 w-full md:w-24 order-2 md:order-1 justify-center">
              {product?.productImage?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`w-20 h-20 object-cover border rounded-lg cursor-pointer transition-all duration-200 
                hover:scale-105 hover:shadow-md ${activeImage === img
                      ? "ring-2 ring-yellow-500"
                      : "ring-1 ring-gray-200"
                    }`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div
              className="flex-1 flex justify-center items-center bg-white p-4 md:p-6 rounded-2xl shadow-md border relative max-h-[400px] md:max-h-[500px] h-[400px] md:h-[500px] w-full order-1 md:order-2"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={activeImage || product?.productImage?.[0]}
                alt={product?.productName}
                className="w-full h-full object-contain rounded-xl cursor-zoom-in m-2"
              />
            </div>

            {/* Zoom Preview */}
            {showZoom && (
              <div className="hidden lg:block absolute -right-[530px] top-0 border bg-white shadow-xl rounded-xl overflow-hidden">
                <div style={zoomStyle}></div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-gray-900 leading-tight">
              {product?.productName}
            </h2>
            <p className="text-gray-600 mb-2 text-base sm:text-lg">
              Brand:{" "}
              <span className="font-semibold text-gray-800">
                {product?.brandName}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Category: {product?.category}
            </p>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-red-600">
                ₹{product?.sellingPrice}
              </span>
              {product?.sellingPrice < product?.price && (
                <>
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    ₹{product?.price}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Save{" "}
                    {Math.round(
                      ((product?.price - product?.sellingPrice) /
                        product?.price) *
                      100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center text-yellow-500 text-xl sm:text-2xl mb-6">
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStarHalf />
              <span className="ml-2 text-sm text-gray-500">(120 reviews)</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
              {product?.discreption}
            </p>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={(e) => handelAddTOCard(e, product._id)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-3 rounded-xl shadow-md w-full sm:w-auto font-semibold transition transform hover:scale-105"
              >
                Add to Cart
              </button>
              <button className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-6 py-3 rounded-xl shadow-md w-full sm:w-auto font-semibold transition transform hover:scale-105" 
              onClick={(e) => handelByeProduct(e, product._id)}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Related Products
        </h3>
        <VerticalCardProduct category={product.category} heading={""} />
      </div>
      <AiChatBot/>
    </div>
  );
}
