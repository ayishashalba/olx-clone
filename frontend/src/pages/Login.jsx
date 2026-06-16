import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
const handleLogin = async (e) => {
  e.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!emailRegex.test(form.email)) {
    toast.error("Enter a valid email address");
    return;
  }

  if (!form.password.trim()) {
    toast.error("Password is required");
    return;
  }

  try {
    const res = await axios.post(
      "https://olx-clone-zg79.onrender.com/api/auth/login",
      form
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Login successful");

    setForm({
      email: "",
      password: "",
    });

    navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://olx-clone-zg79.onrender.com/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");
      setForm({
  email: "",
  password: "",
});
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>

      <form onSubmit={handleLogin} className="auth-form" autoComplete="off">
        <input
  name="email"
  type="text"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
  autoComplete="new-email"
/>

<input
  name="password"
  type="password"
  placeholder="Password"
  value={form.password}
  onChange={handleChange}
  autoComplete="new-password"
/>

        <Link to="/forgot-password" className="forgot-link">
  Forgot Password?
</Link>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;