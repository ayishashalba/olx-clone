import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostAd from "./pages/PostAd";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import MyListings from "./pages/MyListings";
import EditProduct from "./pages/EditProduct";
import AdminUsers from "./pages/AdminUsers";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import BecomeSeller from "./pages/BecomeSeller";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/post-ad" element={<PostAd />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/my-listings" element={<MyListings />} />

        <Route path="/edit-product/:id" element={<EditProduct />} />

        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/become-seller" element={<BecomeSeller />} />
      </Routes>
    </>
  );
}

export default App;