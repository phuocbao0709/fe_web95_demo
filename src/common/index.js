const rawBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim()
const isDev = import.meta.env.DEV

const backendDomin = rawBackendUrl
    ? rawBackendUrl.replace(/\/+$/, "")
    : isDev
        ? "http://localhost:3003"
        : null

if (!backendDomin) {
    throw new Error(
        "Missing VITE_BACKEND_URL in production build. Set it in Vercel Project Settings before deploying."
    )
}

const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    deleteProduct : {
        url : `${backendDomin}/api/delete-product`,
        method : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    createCheckoutSession : {
        url : `${backendDomin}/api/create-checkout-session`,
        method : 'post'
    },
    myOrders : {
        url : `${backendDomin}/api/my-orders`,
        method : 'get'
    },
    orderDetails : {
        url : `${backendDomin}/api/order`,
        method : 'get'
    },
    adminOrders : {
        url : `${backendDomin}/api/admin/orders`,
        method : 'get'
    },
    updateOrderStatus : {
        url : `${backendDomin}/api/admin/order-status`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    }
}


export default SummaryApi
