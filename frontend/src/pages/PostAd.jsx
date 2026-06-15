import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PostAd() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ AUTH CHECK PROPER WAY
  useEffect(() => {
    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      toast.error("Access denied");
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handlePostAd = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("location", form.location);
    formData.append("image", image);

    try {
      await axios.post(
        "https://olx-clone-zg79.onrender.com/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Ad posted successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Ad post failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ cleanup preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="form-container">
      <h1>Post Ad</h1>

      <form onSubmit={handlePostAd} className="auth-form">

        <input name="title" placeholder="Product title" onChange={handleChange} />

        <textarea name="description" placeholder="Description" onChange={handleChange} />

        <input name="price" placeholder="Price" onChange={handleChange} />

        <input name="category" placeholder="Category" onChange={handleChange} />

        <input name="location" placeholder="Location" onChange={handleChange} />

        {/* IMAGE PREVIEW */}
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

        {/* FILE INPUT */}
        <input
          id="imageUpload"
          type="file"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <label htmlFor="imageUpload" className="upload-btn">
          Choose File
        </label>

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Ad"}
        </button>
      </form>
    </div>
  );
}

export default PostAd;