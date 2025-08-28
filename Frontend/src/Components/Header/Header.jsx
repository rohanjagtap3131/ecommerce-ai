import { useContext, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import summuryAPI from "../../Common/index";
import { toast } from "react-toastify";
import { setUserDetails } from "../../Store/userSlice";
import ROLE from "../../Common/role";
import { motion, AnimatePresence } from "framer-motion";
import context from "../../context/index";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [menu, setMenu] = useState(false);
  const count = useContext(context);

  const toggleMenu = () => setMenu((prev) => !prev);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(summuryAPI.userLogout.url, {
        method: summuryAPI.userLogout.method,
        credentials: "include",
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/");
      } else if (data.error) {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Something went wrong");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    } else {
      navigate(`/search`);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      {/* Top Navbar */}
      <div className="h-16 container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://themewagon.github.io/electro/img/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain opacity-80"
          />
          <span className="font-extrabold text-xl lg:text-2xl text-gray-800 tracking-wide">
            Electro
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <form
            className="flex w-full max-w-xl"
            onSubmit={handleSearch}
          >
            <input
              className="border border-gray-300 rounded-l-full px-5 py-2 w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="text-2xl bg-yellow-500 hover:bg-yellow-600 transition duration-200 px-5 rounded-r-full text-white flex items-center justify-center"
            >
              <IoSearchSharp />
            </button>
          </form>
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-5 relative">
          {/* User Dropdown */}
          {user?._id && (
            <div className="relative">
              <div
                className="text-2xl lg:text-3xl cursor-pointer text-gray-700 hover:text-yellow-500 transition"
                onClick={toggleMenu}
              >
                <FaRegUserCircle />
              </div>

              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-10 right-0 bg-white rounded-lg shadow-xl py-2 w-40"
                  >
                    {user?.role === ROLE.ADMIN && (
                      <>
                        <Link
                          to="/admin-panel/product"
                          onClick={toggleMenu}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                        <Link
                          to="/my-orders"
                          onClick={toggleMenu}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      </>
                    )}

                    {user?.role === ROLE.GENERAL && (
                      <Link
                        to="/my-orders"
                        onClick={toggleMenu}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Cart Icon */}
          {user?._id && (
            <Link
              className="relative text-2xl cursor-pointer text-gray-700 hover:text-yellow-500 transition"
              to={"/Cart"}
            >
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count.cartCount}
              </span>
            </Link>
          )}

          {/* Login / Logout */}
          <div>
            {user?._id ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleLogout}
                className="bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600 text-white text-sm lg:text-base transition"
              >
                Logout
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/login"
                  className="bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600 text-white text-sm lg:text-base transition"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar (Mobile) */}
      <div className="block md:hidden px-4 pb-3 bg-white border-t border-gray-100">
        <form className="flex w-full shadow-sm" onSubmit={handleSearch}>
          <input
            className="border border-gray-300 rounded-l-full px-4 py-2 w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="text-xl bg-yellow-500 hover:bg-yellow-600 transition px-4 py-2 rounded-r-full text-white flex items-center justify-center"
          >
            <IoSearchSharp />
          </button>
        </form>
      </div>
    </motion.header>
  );
}
