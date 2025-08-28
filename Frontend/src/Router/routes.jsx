import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../Layout.jsx";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.jsx"
import Signup from "../pages/Signup/Signup.jsx";
import AdminPanel from "../pages/AdminPanel/AdminPanel.jsx";
import AllUser from "../pages/AllUser/AllUser.jsx";
import Produtes from "../pages/Produtes/Produtes.jsx";
import ProductCategory from "../pages/categoryProduct/CategoryProduct.jsx";
import ProductDetails from "../pages/ProductDetails/ProductDetails.jsx"
import Cart from "../pages/Cart/Cart.jsx";
import SearchProduct from "../pages/SearchProduct/SearchProduct.jsx";
import MyOrders from "../pages/MyOrders/MyOrders.jsx"
import AdminAllOrders from "../pages/AdminAllOrders/AdminAllOrders.jsx"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} >
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />

      <Route path="admin-panel" element={<AdminPanel />} >
        <Route path="product" element={<Produtes />} />
        <Route path="all-users" element={<AllUser />} />
        <Route path="all-orders" element={<AdminAllOrders />} />
      </Route>

      <Route path="forgot-Password" element={<ForgotPassword />} />
      <Route path="sign-up" element={<Signup />} />


      <Route path="product-category" element={<ProductCategory/>} />
      <Route path="product/:id" element={<ProductDetails/>} />
      <Route path="Cart" element={<Cart/>} />
      <Route path="search" element={<SearchProduct/>} />


      <Route path="my-orders" element={<MyOrders/>} />      

    </Route>
  )
);

export default router;