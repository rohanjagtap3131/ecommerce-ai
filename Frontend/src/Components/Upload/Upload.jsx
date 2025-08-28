import { useState } from "react";
import { IoClose, IoCloudUploadSharp } from "react-icons/io5";
import productCategory from "../../helper/productCategory";
import uploadImage from "../../helper/uploadImage";
import DisplayImage from "./DisplayImage";
import summuryAPI from "../../Common";
import { toast } from 'react-toastify'


export default function Upload({ onClose ,reload }) {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        discreption: "",
        price: "",
        sellingPrice: "",
    });

    const [open, setOpen] = useState(false);
    const [activeImage, setActiveImage] = useState("");

    const handelUploadSubmit = async (e) => {
        e.preventDefault();

       

        const fatchdata = await fetch(summuryAPI.uploadProduct.url,{
            method: summuryAPI.uploadProduct.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

         if (data.productImage.length === 0) {
            toast.error("Please upload at least one product image.");
            return;
        }
        const dataapi = await fatchdata.json();

        if (dataapi.success) {
            toast.success(dataapi?.message);
            onClose();
            reload();

        }
        if (dataapi.error) {
            toast.error(dataapi?.message);
        }

    }

    const handelOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handelUploadProduct = async (e) => {
        const file = e.target.files[0];
        const uploadImageColudinary = await uploadImage(file);
        setData((prev) => ({
            ...prev,
            productImage: [...prev.productImage, uploadImageColudinary.url],
        }));
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl p-6 overflow-hidden flex flex-col 
                    transition-all duration-300 transform scale-95 opacity-0 animate-[fadeInUp_0.3s_ease-out_forwards]">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Upload Product</h2>
                        <button className="text-2xl text-gray-700 hover:text-red-500" onClick={onClose}>
                            <IoClose />
                        </button>
                    </div>

                    {/* Form */}
                    <form className="flex-1 overflow-y-auto space-y-4 pr-1 " onSubmit={handelUploadSubmit}>
                        <div>
                            <label htmlFor="productName" className="block font-medium text-sm mb-1">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                placeholder="Enter Product Name"
                                value={data.productName}
                                onChange={handelOnChange}
                                className="w-full p-2 bg-gray-100 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="brandName" className="block font-medium text-sm mb-1">Brand Name</label>
                            <input
                                type="text"
                                id="brandName"
                                name="brandName"
                                placeholder="Enter Brand Name"
                                value={data.brandName}
                                onChange={handelOnChange}
                                className="w-full p-2 bg-gray-100 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block font-medium text-sm mb-1">Product Category</label>
                            <select
                                id="category"
                                name="category"
                                value={data.category}
                                onChange={handelOnChange}
                                className="w-full p-2 bg-gray-100 border rounded-md"
                                required
                            >
                                <option value="">Select Category</option>
                                {productCategory.map((el, index) => (
                                    <option value={el.value} key={el.value + index}>{el.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="uploadImageInput" className="block font-medium text-sm mb-1">Upload Image</label>
                            <label htmlFor="uploadImageInput">
                                <div className="p-4 bg-gray-100 border rounded-md h-32 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-200 transition">
                                    <span className="text-4xl text-gray-500">
                                        <IoCloudUploadSharp />
                                    </span>
                                    <p className="text-sm text-gray-500">Upload Product Image</p>
                                    <input
                                        type="file"
                                        id="uploadImageInput"
                                        className="hidden"
                                        onChange={handelUploadProduct}
                                        
                                    />
                                </div>
                            </label>

                            <div className="flex gap-2 mt-2 flex-wrap">
                                {data.productImage.length > 0 ? (
                                    data.productImage.map((el, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={el}
                                                alt={`uploaded-${index}`}
                                                className="w-20 h-20 object-cover border rounded cursor-pointer"
                                                onClick={() => {
                                                    setOpen(true);
                                                    setActiveImage(el);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 bg-white text-red-600 rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        productImage: prev.productImage.filter((_, i) => i !== index),
                                                    }));
                                                }}
                                            >
                                                <IoClose />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-red-500 mt-1">*Please upload at least one product image</p>
                                )}
                            </div>
                        </div>

                        {/* Price Fields Side by Side */}
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="price" className="block font-medium text-sm mb-1">Product Price</label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    id="price"
                                    name="price"
                                    placeholder="Enter Product Price"
                                    value={data.price}
                                    onChange={handelOnChange}
                                    className="w-full p-2 bg-gray-100 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="sellingPrice" className="block font-medium text-sm mb-1">Selling Price</label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    id="sellingPrice"
                                    name="sellingPrice"
                                    placeholder="Enter Selling Price"
                                    value={data.sellingPrice}
                                    onChange={handelOnChange}
                                    className="w-full p-2 bg-gray-100 border rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="discreption" className="block font-medium text-sm mb-1">Discreption</label>
                            <textarea
                                type="text"
                                id="discreption"
                                name="discreption"
                                placeholder="Enter product discreption"
                                value={data.discreption}
                                onChange={handelOnChange}
                                className="w-full p-2 bg-gray-100 border rounded-md"
                                required
                            >
                            </textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
                        >
                            Upload Product
                        </button>
                    </form>
                </div>

                {open && <DisplayImage onClose={() => setOpen(false)} image={activeImage} />}
            </div>

            {/* Keyframes for animation */}
            <style>
                {`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                `}
            </style>
        </>
    );
}
