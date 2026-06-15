import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PostAd.css";

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
      setPreview(URL.createObjectURL(file));
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
    Object.keys(form).forEach((key) =>
      formData.append(key, form[key])
    );
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

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="post-page">

      <div className="post-container">

        {/* LEFT SIDE */}
        <div className="post-left">
          <h2 className="heading">POST YOUR AD</h2>

          <input
            name="title"
            placeholder="Product Title"
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="textarea"
          />

          <div className="row">
            <input
              name="price"
              placeholder="Price"
              onChange={handleChange}
              className="input"
            />

            <input
              name="category"
              placeholder="Category"
              onChange={handleChange}
              className="input"
            />
          </div>

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="input"
          />

          {/* UPLOAD */}
          <input
            type="file"
            id="imageUpload"
            hidden
            onChange={handleImageChange}
          />

          <label htmlFor="imageUpload" className="upload-btn">
            Choose File
          </label>

          <button
            onClick={handlePostAd}
            disabled={loading}
            className="post-btn"
          >
            {loading ? "Posting..." : "POST AD"}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="post-right">
          <h3 className="preview-heading">Preview</h3>

          {preview ? (
            <img src={preview} alt="preview" className="preview-img" />
          ) : (
            <div className="no-preview">
              No image selected
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PostAd;