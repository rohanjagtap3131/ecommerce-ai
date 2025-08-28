
const backendDomain = "http://localhost:8000/api"
const summuryAPI = {
    Signup: {
        url: `${backendDomain}/signup`,
        method: "post"
    },
    Signin: {
        url: `${backendDomain}/signin`,
        method: "post"
    },

    UserDetails: {
        url: `${backendDomain}/user-details`,
        method: "get"
    },
    userLogout: {
        url: `${backendDomain}/user-logout`,
        method: "get"
    },
    allUsers: {
        url: `${backendDomain}/all-Users`,
        method: "get"
    },
    updateUser: (id) => ({
        url: `${backendDomain}/update-user/${id}`,
        method: "put"
    }),
    uploadProduct: {
        url: `${backendDomain}/upload-product`,
        method: "post"
    },
    getProduct: {
        url: `${backendDomain}/get-Product`,
        method: "get"
    },
    updateProduct: (id) => ({
        url: `${backendDomain}/update-product/${id}`,
        method: "put"
    }),
    categoryProduct: {
        url: `${backendDomain}/get-categeoryProduct`,
        method: "get"
    },
    categoryProdutes: {
        url: `${backendDomain}/categeory-product`,
        method: "post"
    },
    productDetails: {
        url: `${backendDomain}/product-details`,
        method: "post"
    },
    addToCart: {
        url: `${backendDomain}/addtocart`,
        method: "post"
    },
    CartProductCount: {
        url: `${backendDomain}/countCartProduct`,
        method: "get"
    },
    viewCart: {
        url: `${backendDomain}/view-cartProduct`,
        method: "get"
    },
    viewCartUpdate: (id) => ({
        url: `${backendDomain}/update-cartProduct/${id}`,
        method: "put"
    }),
    viewCartDelete: (id) => ({
        url: `${backendDomain}/remove-cartProduct/${id}`,
        method: "delete",
    }),
    searchProduct: {
        url: `${backendDomain}/search`,
        method: "get"
    },
    filter: {
        url: `${backendDomain}/filter-product`,
        method: "post"
    },
    createOrder: {
        url: `${backendDomain}/create-order`,
        method: "post",
    },
    verifyPayment: {
        url: `${backendDomain}/verify-payment`,
        method: "post",
    },
    getOrders: {
        url: `${backendDomain}/my-orders`,
        method: "get",
    },
    getAllOrders: {
        url: `${backendDomain}/all-orders`,
        method: "get",
    },
    updateOrders: (id) => ({
        url: `${backendDomain}/update-tracking/${id}`,
        method: "put",
    }),
    cancelOrders: (id) => ({
        url: `${backendDomain}/cancel/${id}`,
        method: "put",
    }),
    deleteOrders: (id) => ({
        url: `${backendDomain}/order/${id}`,
        method: "delete",
    }),
    aiChat: {
        url: `${backendDomain}/chat`,
        method: "post",
    }


}

export default summuryAPI;