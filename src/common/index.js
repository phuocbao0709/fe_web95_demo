const rawBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim()
const isDev = import.meta.env.DEV
const currentHostname = typeof window !== "undefined" ? window.location.hostname : ""
const isLocalRuntime = currentHostname === "localhost" || currentHostname === "127.0.0.1"
const localDevelopmentBackendUrl = "http://localhost:3003"
const stableProductionBackendUrl = "https://be-web95-demo.vercel.app"

const normalizeBackendUrl = (url) => {
    if (!url) {
        return url
    }

    const sanitizedUrl = url.replace(/\/+$/, "")

    // Avoid pinning production to a protected/stale deployment URL.
    if (/^https:\/\/be-web95-demo-[a-z0-9]+-phuocbao0709s-projects\.vercel\.app$/i.test(sanitizedUrl)) {
        return stableProductionBackendUrl
    }

    return sanitizedUrl
}

const resolvedEnvBackendUrl = rawBackendUrl ? normalizeBackendUrl(rawBackendUrl) : ""

const backendDomain = (() => {
    if (isDev) {
        return resolvedEnvBackendUrl || localDevelopmentBackendUrl
    }

    if (!resolvedEnvBackendUrl) {
        return stableProductionBackendUrl
    }

    if (!isLocalRuntime && /^http:\/\/localhost(?::\d+)?$/i.test(resolvedEnvBackendUrl)) {
        return stableProductionBackendUrl
    }

    return resolvedEnvBackendUrl
})()

const SummaryApi = {
    signUP : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomain}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomain}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomain}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method  : 'post'
    },
    deleteProduct : {
        url : `${backendDomain}/api/delete-product`,
        method : 'post'
    },
    categoryProduct : {
        url : `${backendDomain}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomain}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomain}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomain}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomain}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomain}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomain}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomain}/api/delete-cart-product`,
        method : 'post'
    },
    createCheckoutSession : {
        url : `${backendDomain}/api/create-checkout-session`,
        method : 'post'
    },
    confirmCheckoutSession : {
        url : `${backendDomain}/api/confirm-checkout-session`,
        method : 'get'
    },
    myOrders : {
        url : `${backendDomain}/api/my-orders`,
        method : 'get'
    },
    orderDetails : {
        url : `${backendDomain}/api/order`,
        method : 'get'
    },
    adminOrders : {
        url : `${backendDomain}/api/admin/orders`,
        method : 'get'
    },
    updateOrderStatus : {
        url : `${backendDomain}/api/admin/order-status`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomain}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomain}/api/filter-product`,
        method : 'post'
    }
}


export default SummaryApi
