
const backendDomain = import.meta.env.VITE_BACKEND_URL;
const summuryAPI = {
    Signup: {
        url: `${backendDomain}/api/signup`,
        method: "post"
    },
    Signin: {
        url: `${backendDomain}/api/signin`,
        method: "post"
    },

    UserDetails: {
        url: `${backendDomain}/api/user-details`,
        method: "get"
    },
    userLogout: {
        url: `${backendDomain}/api/user-logout`,
        method: "get"
    },
    allUsers: {
        url: `${backendDomain}/api/all-Users`,
        method: "get"
    },
    updateUser: (id) => ({
        url: `${backendDomain}/api/update-user/${id}`,
        method: "put"
    }),
    uploadProduct: {
        url: `${backendDomain}/api/upload-product`,
        method: "post"
    },
    getProduct: {
        url: `${backendDomain}/api/get-Product`,
        method: "get"
    },
    updateProduct: (id) => ({
        url: `${backendDomain}/api/update-product/${id}`,
        method: "put"
    }),
    categoryProduct: {
        url: `${backendDomain}/api/get-categeoryProduct`,
        method: "get"
    },
    categoryProdutes: {
        url: `${backendDomain}/api/categeory-product`,
        method: "post"
    },
    productDetails: {
        url: `${backendDomain}/api/product-details`,
        method: "post"
    },
    addToCart: {
        url: `${backendDomain}/api/addtocart`,
        method: "post"
    },
    CartProductCount: {
        url: `${backendDomain}/api/countCartProduct`,
        method: "get"
    },
    viewCart: {
        url: `${backendDomain}/api/view-cartProduct`,
        method: "get"
    },
    viewCartUpdate: (id) => ({
        url: `${backendDomain}/api/update-cartProduct/${id}`,
        method: "put"
    }),
    viewCartDelete: (id) => ({
        url: `${backendDomain}/api/remove-cartProduct/${id}`,
        method: "delete",
    }),
    searchProduct: {
        url: `${backendDomain}/api/search`,
        method: "get"
    },
    filter: {
        url: `${backendDomain}/api/filter-product`,
        method: "post"
    },
    createOrder: {
        url: `${backendDomain}/api/create-order`,
        method: "post",
    },
    verifyPayment: {
        url: `${backendDomain}/api/verify-payment`,
        method: "post",
    },
    getOrders: {
        url: `${backendDomain}/api/my-orders`,
        method: "get",
    },
    getAllOrders: {
        url: `${backendDomain}/api/all-orders`,
        method: "get",
    },
    updateOrders: (id) => ({
        url: `${backendDomain}/api/update-tracking/${id}`,
        method: "put",
    }),
    cancelOrders: (id) => ({
        url: `${backendDomain}/api/cancel/${id}`,
        method: "put",
    }),
    deleteOrders: (id) => ({
        url: `${backendDomain}/api/order/${id}`,
        method: "delete",
    }),
    aiChat: {
        url: `${backendDomain}/api/chat`,
        method: "post",
    }


}

export default summuryAPI;