import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import summuryAPI from "../../Common";
import Upload from "../../Components/Upload/Upload";
import AdminProduct from "../../Components/AdminProductCart/AdminProduct";
import AiChatBot from "../../Components/AiChatBot/AiChatBot";

export default function Products() {
  const [openUpload, setOpenUpload] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const displayProduct = async () => {
    try {
      const fetchAllProduct = await fetch(summuryAPI.getProduct.url);
      const dataResponse = await fetchAllProduct.json();
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    displayProduct();
  }, []);

  return (
    <div className="p-4 h-screen flex flex-col relative bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white py-4 px-6 flex flex-wrap gap-3 justify-between items-center rounded-xl shadow-md border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-700">📦 All Products</h2>
        <button
          className="border border-yellow-500 bg-yellow-50 hover:bg-yellow-500 hover:text-white text-yellow-600 font-semibold py-2 px-5 rounded-lg shadow-sm transition-all duration-200"
          onClick={() => setOpenUpload(true)}
        >
          + Upload Product
        </button>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="mt-6 overflow-y-auto flex-1 pr-1 scroll-smooth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {allProduct.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {allProduct.map((product, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <AdminProduct data={product} fetchdata={displayProduct} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500 text-lg">
            No products found.
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {openUpload && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
                onClick={() => setOpenUpload(false)}
              >
                &times;
              </button>

              <Upload
                onClose={() => setOpenUpload(false)}
                reload={displayProduct}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AiChatBot/>
    </div>
  );
}
