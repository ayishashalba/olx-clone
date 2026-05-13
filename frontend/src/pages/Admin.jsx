import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Admin() {
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchAdminProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/admin/listings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin access failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAdminProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminProducts();
    }
  }, []);

  if (!user || user.role !== "admin") {
    return <h1>Access Denied: Admin only</h1>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <Link to="/admin/users">
        <button>Manage Users</button>
      </Link>

      <h2>Listings</h2>

      <div className="admin-list">
        {products.map((product) => (
          <div className="admin-item" key={product._id}>
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.title}
            />

            <div>
              <h3>{product.title}</h3>
              <p>₹ {product.price}</p>
              <p>Seller: {product.seller?.name}</p>
              <p>Email: {product.seller?.email}</p>
            </div>

            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;