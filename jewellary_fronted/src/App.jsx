import { Routes, Route } from "react-router-dom";
import Layout from "./components/user/Layout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// user pages
import Home from "./pages/user/Home";
import Contact from "./pages/user/Contact";
import About from "./pages/user/About";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Products from "./pages/user/Products";
import ProductDetail from "./pages/user/ProductDetail";
import NotFound from "./pages/user/NotFound";
import UserProfile from "./pages/user/UserProfile";
import Checkout from "./pages/user/Checkout";
import Wishlist from "./pages/user/Wishlist";
import Account from "./pages/user/Account";

// admin pages
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/Layout";
import AdminProducts from "./pages/admin/UploadProduct";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Account";
import AdminDashbord from "./pages/admin/Dashbord";
import AdminSales from "./pages/admin/Sales";
import ProductList from "./pages/admin/ProductList";
import ProductUpdate from "./pages/admin/ProductUpdate";

function App() {
return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="ProductDetail/:id" element={<ProductDetail />} />
          <Route path="UserProfile" element={<UserProfile />} />
          <Route path="Checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashbord />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="product-update/:id" element={<ProductUpdate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
