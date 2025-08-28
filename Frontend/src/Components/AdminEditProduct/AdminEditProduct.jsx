import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import productCategory from '../../helper/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../../helper/uploadImage';
import DisplayImage from '../Upload/DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../../Common/index';
import { toast } from 'react-toastify';

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    _id: productData?._id,
    productName: productData?.productName || '',
    brandName: productData?.brandName || '',
    category: productData?.category || '',
    productImage: productData?.productImage || [],
    discreption: productData?.discreption || '',
    price: productData?.price || '',
    sellingPrice: productData?.sellingPrice || ''
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadImageCloudinary = await uploadImage(file);

    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }));
  };

  const handleDeleteProductImage = (index) => {
    const newImages = [...data.productImage];
    newImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.updateProduct(productData._id).url, {
      method: SummaryApi.updateProduct(productData._id).method,
      credentials: 'include',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    } else if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b  text-white">
          <h2 className="font-semibold text-lg">Edit Product</h2>
          <button
            className="text-2xl text-black"
            onClick={onClose}
          >
            <CgClose />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Product Name */}
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              placeholder="Enter product name"
              className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block mb-1 font-medium">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={data.brandName}
              onChange={handleOnChange}
              placeholder="Enter brand name"
              className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={data.category}
              onChange={handleOnChange}
              className="w-full p-2 rounded-lg border bg-white focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            >
              <option value="">Select Category</option>
              {productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>
                  {el.label}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Product Images</label>
            <label
              htmlFor="uploadImageInput"
              className="block p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-yellow-400 transition"
            >
              <FaCloudUploadAlt className="text-4xl mx-auto text-yellow-500" />
              <p className="text-sm text-gray-500">Click to upload</p>
              <input
                type="file"
                id="uploadImageInput"
                className="hidden"
                accept="image/*"
                onChange={handleUploadProduct}
              />
            </label>

            {/* Image Preview */}
            {data?.productImage?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {data.productImage.map((el, index) => (
                  <div
                    className="relative group"
                    key={index}
                  >
                    <img
                      src={el}
                      alt="product"
                      className="w-20 h-20 rounded-lg border object-cover transform group-hover:scale-105 transition"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteProductImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition hidden group-hover:block"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleOnChange}
                placeholder="Enter price"
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                value={data.sellingPrice}
                onChange={handleOnChange}
                placeholder="Enter selling price"
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="discreption"
              value={data.discreption}
              onChange={handleOnChange}
              placeholder="Enter product description"
              rows={3}
              className="w-full p-2 rounded-lg border resize-none focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition font-medium"
          >
            Update Product
          </button>
        </form>
      </div>

      {/* Full Screen Image */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
