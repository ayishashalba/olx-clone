import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    await axios.post(
      "https://olx-clone-zg79.onrender.com/api/auth/register",
      form
    );

    toast.success("OTP sent to email");

    navigate("/verify-otp", {
      state: {
        email: form.email,
      },
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Register failed"
    );
  }
};

  return (
    <div className="form-container">
      <h1>Register</h1>

      <form
        onSubmit={handleRegister}
        className="auth-form"
        autoComplete="off"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="off"
        />

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

        <div className="role-select">
          <p>I want to:</p>

          <label>
            <input
              type="checkbox"
              checked={form.role === "buyer"}
              onChange={() =>
                setForm({ ...form, role: "buyer" })
              }
            />
            🛒 Buy products
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.role === "seller"}
              onChange={() =>
                setForm({ ...form, role: "seller" })
              }
            />
            🏷️ Sell products
          </label>
        </div>

        <button type="submit">Register</button>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;