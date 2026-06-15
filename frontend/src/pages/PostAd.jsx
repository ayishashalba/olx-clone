import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PostAd() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

if (!user || (user.role !== "seller" && user.role !== "admin")) {
  return <h1>Access Denied: Only sellers can post ads</h1>;
}

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePostAd = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("location", form.location);
    formData.append("image", image);

    try {
      await axios.post("https://olx-clone-zg79.onrender.com/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Ad posted successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Ad post failed");
    }
  };

  return (
    <div className="form-container">
      <h1>Post Ad</h1>

      <form onSubmit={handlePostAd} className="auth-form">
        <input name="title" placeholder="Product title" onChange={handleChange} />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <input name="price" placeholder="Price" onChange={handleChange} />

        <input name="category" placeholder="Category" onChange={handleChange} />

        <input name="location" placeholder="Location" onChange={handleChange} />

{preview && (
  <img
    src={preview}
    alt="preview"
    style={{
      width: "200px",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "10px",
    }}
  />
)}

<input
  id="imageUpload"
  type="file"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }}
/>

<label htmlFor="imageUpload" className="upload-btn">
  Choose File
</label>

<button type="submit">Post Ad</button>
      </form>
    </div>
  );
}

export default PostAd;