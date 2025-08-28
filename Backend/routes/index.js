const express = require('express');

const router = express.Router();

const userSignUPController = require("../controller/user/userSignUp")
const userSignInControler = require("../controller/user/userSignIn");
const  userDetialControler = require("../controller/user/userDetilsControler");
const authorrizeUser = require("../middleware/authorrizeUser");
const userLogOut = require("../controller/user/userLogOut");
const allUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");
const uploadProductControler = require("../controller/product/uploadProduct");
const getProductControler = require("../controller/product/getProduct");
const updateProduct = require("../controller/product/updateProduct");
const getSingleCategeoryProduct = require("../controller/product/getSingleCategoryProduct");
const getCategoryProducts = require("../controller/product/getCategoryProducts")
const getProductDetails = require("../controller/product/getProductDetails");
const addToCartController = require("../controller/user/addToCartController");
const countAddToCartComp =require("../controller/user/countAddToCartComp");
const addToCardView =require("../controller/user/addToCardView");
const updateCart =require("../controller/user/updateCart");
const  removeCartItem = require("../controller/user/removeCartItem");
const searchproduct = require("../controller/product/searchProduct");
const filterProduct = require("../controller/product/filterProduct");
const { createOrder, verifyPayment, getMyOrders  } = require("../controller/order/orderController");
const adminOrdersDetails = require("../controller/order/adminOrdersDetails");
const updateAdminOrders = require('../controller/order/updateAdminOrders');
const cancelOrder = require("../controller/order/cancelOrder");
const deleteOrder = require("../controller/order/deleteOrder");
const chatbot = require("../controller/OpenAi/chatbot");



router.post("/signup",userSignUPController);
router.post("/signin",userSignInControler);
router.get("/user-details",authorrizeUser,userDetialControler);
router.get("/user-logout",userLogOut);



//admin panel//
router.get("/all-Users",authorrizeUser,allUsers);
router.put("/update-user/:id", authorrizeUser, updateUser);

// product//
router.post("/upload-product",authorrizeUser,uploadProductControler);
router.get("/get-Product",getProductControler);
router.put("/update-product/:id", authorrizeUser, updateProduct);
router.get("/get-categeoryProduct", getSingleCategeoryProduct);
router.post("/categeory-product", getCategoryProducts);
router.post("/product-details", getProductDetails);
router.get("/search", searchproduct);
router.post("/filter-product", filterProduct);

// Cart //
router.post("/addtocart",authorrizeUser,addToCartController);
router.get("/countCartProduct",authorrizeUser,countAddToCartComp);
router.get("/view-cartProduct",authorrizeUser,addToCardView);
router.put("/update-cartProduct/:id",authorrizeUser,updateCart);
router.delete("/remove-cartProduct/:id", authorrizeUser, removeCartItem);

// Payment / Orders
router.post("/create-order", authorrizeUser, createOrder);
router.post("/verify-payment", authorrizeUser, verifyPayment);
router.get("/my-orders", authorrizeUser, getMyOrders);
router.get("/all-orders", authorrizeUser, adminOrdersDetails);
router.put("/update-tracking/:orderId",authorrizeUser,updateAdminOrders);
router.put("/cancel/:id",authorrizeUser,cancelOrder);
router.delete("/order/:id",authorrizeUser,deleteOrder);

// OpenAi
router.post("/chat",chatbot);


module.exports = router;