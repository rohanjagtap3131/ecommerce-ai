import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import { useEffect, useState } from "react";
import summuryAPI from "./Common/index";
import Context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./Store/userSlice";

export default function Layout() {
    const dispatch = useDispatch();
    const [cartCount , setCartCount] = useState(0);

    const fetchUserDetails = async () => {
        try {
            const dataResponse = await fetch(summuryAPI.UserDetails.url, {
                method: summuryAPI.UserDetails.method,
                credentials: "include"
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                dispatch(setUserDetails(dataApi.data));
            }
        } catch (error) {
            console.error("❌ Failed to fetch user details:", error);
        }
    }

    const fetchCartCount = async () => {
        try {
            const countResponse = await fetch(summuryAPI.CartProductCount.url, {
                method: summuryAPI.CartProductCount.method,
                credentials: "include",
            });

            const countdata = await countResponse.json();

            console.log("Cart count:", countdata);

            // ✅ Always set a safe fallback (0 instead of undefined)
            setCartCount(countdata?.data?.cartCount ?? 0);
        } catch (error) {
            console.error("❌ Failed to fetch cart count:", error);
            setCartCount(0); // fallback
        }
    }

    useEffect(() => {
        fetchUserDetails();
        fetchCartCount();
    }, [cartCount]);

    return (
        <div>
            <Context.Provider value={{
                fetchUserDetails,
                cartCount,
                fetchCartCount
            }}>
                <ToastContainer 
                    position="top-center" 
                    autoClose={3000} 
                    limit={3}   // ✅ prevents toast overflow
                />
                <Header />
                <main className="min-h-[calc(100vh-120px)]">
                    <Outlet />
                </main>
                <Footer />
            </Context.Provider>
        </div>
    )
}
