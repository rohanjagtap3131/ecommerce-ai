import { FaRegUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../../Common/role";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

export default function AdminPanel() {
    const user = useSelector((state) => state?.user?.user);
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenu((prev) => !prev);

    useEffect(() => {
        if (user && user.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [user]);

    return (
        <div className="min-h-[calc(100vh-120px)] flex bg-gray-100">
            {/* Sidebar for desktop */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="hidden md:flex flex-col bg-white w-64 shadow-lg"
            >
                {/* Profile Section */}
                <div className="h-40 flex flex-col justify-center items-center bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-b-xl">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        className="text-5xl text-white cursor-pointer"
                    >
                        <FaRegUserCircle />
                    </motion.div>
                    <p className="capitalize text-white font-semibold mt-2 text-lg">
                        {user?.name}
                    </p>
                    <p className="text-white text-sm">{user?.role}</p>
                </div>

                {/* Navigation Links */}
                <nav className="grid p-4 text-gray-800 font-medium space-y-2">
                    <Link
                        to="all-users"
                        className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                    >
                        👥 All Users
                    </Link>
                    <Link
                        to="product"
                        className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                    >
                        📦 All Products
                    </Link>
                    <Link
                        to="all-orders"
                        className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                    >
                        🛒 Orders
                    </Link>
                </nav>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {menu && (
                    <motion.aside
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col md:hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-2xl text-gray-700"
                        >
                            <HiX />
                        </button>

                        {/* Profile Section */}
                        <div className="h-40 flex flex-col justify-center items-center bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-b-xl">
                            <div className="text-5xl text-white">
                                <FaRegUserCircle />
                            </div>
                            <p className="capitalize text-white font-semibold mt-2 text-lg">
                                {user?.name}
                            </p>
                            <p className="text-white text-sm">{user?.role}</p>
                        </div>

                        {/* Navigation Links */}
                        <nav className="grid p-4 text-gray-800 font-medium space-y-2">
                            <Link
                                to="all-users"
                                className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                                onClick={toggleMenu}
                            >
                                👥 All Users
                            </Link>
                            <Link
                                to="product"
                                className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                                onClick={toggleMenu}
                            >
                                📦 All Products
                            </Link>
                            <Link
                                to="all-orders"
                                className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                                onClick={toggleMenu}
                            >
                                🛒 Orders
                            </Link>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white shadow sticky top-0 z-40">
                    <button
                        onClick={toggleMenu}
                        className="text-2xl text-gray-700"
                    >
                        <HiMenu />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">
                        Admin Dashboard
                    </h1>
                    <FaRegUserCircle className="text-2xl text-gray-600" />
                </div>

                {/* Content */}
                <motion.main
                    className="w-full p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <Outlet />
                </motion.main>
            </div>
        </div>
    );
}
