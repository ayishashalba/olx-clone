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
  const validateName = (name) => {
  const nameRegex = /^([A-Z][a-zA-Z]{1,})(\s[A-Z][a-zA-Z]{1,})*$/;
  return nameRegex.test(name.trim());
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!validateName(form.name)) {
    toast.error(
      "Name must start with capital letters and each word must contain at least 2 letters"
    );
    return;
  }

  if (!validateEmail(form.email)) {
    toast.error("Enter a valid email address");
    return;
  }

  if (!validatePassword(form.password)) {
    toast.error(
      "Password must be at least 6 characters and contain a letter and a number"
    );
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      form
    );

    console.log("REGISTER RESPONSE:", res.data);

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