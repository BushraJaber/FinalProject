import { createBrowserRouter } from "react-router-dom";
import Root from "../Root.jsx";
import Home from "../Components/user/Home/Home.jsx";
import Login from "../Pages/user/Login/Login.jsx";
import Register from "../Pages/user/Register/Register.jsx"; // Ensure this path is correct
import Categories from "../Components/user/Categories/Categories.jsx"; 
import CategoryDetails from "../Pages/user/CategoryDetails/CategoryDetails.jsx";
import Product from "../Pages/user/product/product.jsx"; 
import AllProduct from "../Pages/user/allproduct/Allproduct.jsx";
import ForgotPassword from "../pages/user/ForgotPassword/ForgotPassword.jsx"; // Ensure the component is imported correctly
import Cart from "../Pages/user/Cart/Cart.jsx"; // Import Cart component
import Order from "../Pages/user/Order/Order.jsx"; // Import the Order component
import Profile from "../Pages/user/Profile/Profile.jsx"; // تأكد من المسار الصحيح




const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: '/register', // Ensure this path is correct
        element: <Register />
      },
      {
        path: '/categories',
        element: <Categories />
      },
      {
        path: '/CategoryDetails/:categoryId',
        element: <CategoryDetails />
      },
      {
        path: '/product/:productId',
        element: <Product />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />, // Add this path here
      },
      {
        path: '/AllProduct', // Ensure the path is correctly written as AllProduct
        element: <AllProduct />,
        errorElement: <div>Oops! This page is not found.</div>, // Custom error message
      },
      {
        path: '/cart', // Path for Cart page
        element: <Cart />, // Cart page component
      },
      {
        path: '/order', // Path for Order page
        element: <Order />, // Order page component
      },
      {
        path: '/profile', // Path for Profile page
        element: <Profile />, // Profile page component
      }
    ]
  }
]);

export default router;
