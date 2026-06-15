import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const [image, setImage] = useState(null);
const [currentImage, setCurrentImage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const fetchProduct = async () => {
  const res = await axios.get(
    `https://olx-clone-zg79.onrender.com/api/products/${id}`
  );

  console.log("PRODUCT DATA:", res.data);

  setForm({
    title: res.data.title,
    description: res.data.description,
    price: res.data.price,
    category: res.data.category,
    location: res.data.location,
  });

  setCurrentImage(res.data.image);
};

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("location", form.location);

    // send image only if user selected new image
    if (image) {
      formData.append("image", image);
    }

    await axios.put(
      `https://olx-clone-zg79.onrender.com/api/products/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Product updated successfully");
    navigate("/my-listings");

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  }
};

  return (
    <div className="form-container">
      <h1>Edit Product</h1>

      <form onSubmit={updateProduct} className="auth-form">
        <input name="title" value={form.title} onChange={handleChange} />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input name="price" value={form.price} onChange={handleChange} />

        <input name="category" value={form.category} onChange={handleChange} />

        <input name="location" value={form.location} onChange={handleChange} />

<label>Product Image</label>

{currentImage && (
  <img
    src={
      image
        ? URL.createObjectURL(image)
        : `https://olx-clone-zg79.onrender.com/uploads/${currentImage}`
    }
    alt="product"
    style={{
      width: "200px",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
    }}
  />
)}
<input
  id="imageUpload"
  type="file"
  style={{ display: "none" }}
  onChange={(e) => setImage(e.target.files[0])}
/>

<label htmlFor="imageUpload" className="upload-btn">
  Choose File
</label>

<button type="submit">Update Products</button>
      </form>
    </div>
  );
}

export default EditProduct;