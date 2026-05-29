import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminPanel from "../pages/AdminPanel";
import AdminOrders from "../pages/AdminOrders";
import AllProducts from "../pages/AllProducts";
import AllUsers from "../pages/AllUsers";
import Cart from "../pages/Cart";
import CategoryProduct from "../pages/CategoryProduct";
import CheckoutCancel from "../pages/CheckoutCancel";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import ForgotPassowrd from "../pages/ForgotPassowrd";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyOrders from "../pages/MyOrders";
import ProductDetails from "../pages/ProductDetails";
import SearchProduct from "../pages/SearchProduct";
import SignUp from "../pages/SignUp";

const adminRoutes = [
  {
    path: "all-users",
    element: <AllUsers />,
  },
  {
    path: "all-products",
    element: <AllProducts />,
  },
  {
    path: "orders",
    element: <AdminOrders />,
  },
];

const appRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassowrd />,
  },
  {
    path: "sign-up",
    element: <SignUp />,
  },
  {
    path: "product-category",
    element: <CategoryProduct />,
  },
  {
    path: "product/:id",
    element: <ProductDetails />,
  },
  {
    path: "cart",
    element: <Cart />,
  },
  {
    path: "checkout/success",
    element: <CheckoutSuccess />,
  },
  {
    path: "checkout/cancel",
    element: <CheckoutCancel />,
  },
  {
    path: "search",
    element: <SearchProduct />,
  },
  {
    path: "my-orders",
    element: <MyOrders />,
  },
  {
    path: "admin-panel",
    element: <AdminPanel />,
    children: adminRoutes,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: appRoutes,
  },
]);

export default router;
