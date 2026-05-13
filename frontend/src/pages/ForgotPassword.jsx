import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/forgot-password",
        form
      );

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="form-container">
      <h1>Forgot Password</h1>

      <form onSubmit={handleResetPassword} className="auth-form">
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange}
        />

        <input
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          onChange={handleChange}
        />

        <button type="submit">Change Password</button>

        <Link to="/login">Back to Login</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;