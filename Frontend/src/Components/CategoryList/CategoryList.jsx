import React, { useEffect, useRef, useState } from 'react';
import SummaryApi from '../../Common';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const categoryLoading = new Array(12).fill(null);

  const fetchCategoryProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.categoryProduct.url);
      const dataResponse = await response.json();

      // Artificial delay so skeleton is visible
      setTimeout(() => {
        setCategoryProduct(dataResponse.data || []);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      {/* Responsive Scrollable List */}
      <motion.div
        ref={scrollRef}
        className="flex items-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {loading
          ? categoryLoading.map((_, index) => (
              <div
                key={`loading-${index}`}
                className="flex flex-col items-center flex-shrink-0"
              >
                {/* Circle Skeleton */}
                <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full bg-gray-200 animate-pulse shadow"></div>
                {/* Text Skeleton */}
                <div className="mt-2 h-3 w-10 sm:w-12 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))
          : categoryProduct.map((product, index) => (
              <motion.div
                key={product?.category || index}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="flex-shrink-0"
              >
                <Link
                  to={`product-category?category=${product?.category}`}
                  className="group flex flex-col items-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center border border-gray-100 hover:border-yellow-400 transition-all duration-300">
                    <img
                      src={product?.productImage?.[0]}
                      alt={product?.category}
                      className="h-6 sm:h-8 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-125"
                    />
                  </div>
                  <p className="mt-1 text-[10px] sm:text-xs md:text-sm font-medium capitalize text-gray-700 group-hover:text-yellow-500 transition-colors whitespace-nowrap">
                    {product?.category}
                  </p>
                </Link>
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

export default CategoryList;
