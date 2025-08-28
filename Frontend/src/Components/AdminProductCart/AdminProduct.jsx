import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from '../AdminEditProduct/AdminEditProduct';
import displayINRCurrency from '../../helper/displayCurrency';

const AdminProduct = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);

    const handleEditClick = () => {
        console.log("Opening edit modal for:", data);
        setEditProduct(true);
    };

    return (
        <div 
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center max-w-xs w-full"
        >
            {/* Product Image */}
            <div className="w-36 h-36 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
                <img 
                    src={data?.productImage?.[0]} 
                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                    alt={data?.productName}
                />   
            </div> 

            {/* Product Name */}
            <h1 className="mt-3 text-sm sm:text-base font-medium text-gray-800 text-center line-clamp-2">
                {data?.productName}
            </h1>

            {/* Price + Edit */}
            <div className="flex items-center justify-between mt-3 w-full px-1">
                <p className="font-semibold text-gray-700 text-sm sm:text-base">
                    {displayINRCurrency(data?.sellingPrice)}
                </p>

                <button
                    className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer transition duration-300 ease-in-out"
                    onClick={handleEditClick}
                    title="Edit Product"
                >
                    <MdModeEditOutline size={18}/>
                </button>
            </div>

            {/* Modal */}
            {editProduct && data && ReactDOM.createPortal(
                <AdminEditProduct 
                    productData={data} 
                    onClose={() => setEditProduct(false)} 
                    fetchdata={fetchdata} 
                />,
                document.body
            )}
        </div>
    );
}

export default AdminProduct;
