import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      toast.success("OTP sent to email");

navigate("/verify-otp", {
  state: {
    email: form.email,
  },
});
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Register failed");
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>

      <form onSubmit={handleRegister} className="auth-form">
        <input name="name" placeholder="Name" onChange={handleChange} />

        <input name="email" placeholder="Email" onChange={handleChange} />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <select name="role" value={form.role} onChange={handleChange}>
  <option value="buyer">Buyer</option>
  <option value="seller">Seller</option>
  <option value="admin">Admin</option>
</select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;