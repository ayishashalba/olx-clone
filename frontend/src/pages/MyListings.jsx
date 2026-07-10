import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MyListings() {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMyListings = async () => {
    try {
      const res = await axios.get(
        "https://olx-clone-zg79.onrender.com/api/products/my/listings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch listings");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `https://olx-clone-zg79.onrender.com/api/products/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMyListings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://olx-clone-zg79.onrender.com/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchMyListings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  return (
    <div className="home">
      <h1>My Listings</h1>

      <div className="product-grid">
        {products.length === 0 && <h2>No listings found</h2>}

        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="listing-image-wrapper">
              <img
                className={product.status === "sold" ? "sold-image" : ""}
                src={`https://olx-clone-zg79.onrender.com/uploads/${product.image}`}
                alt={product.title}
              />

              {product.status === "sold" && (
                <div className="sold-badge">SOLD</div>
              )}
            </div>

            <h3>₹ {product.price}</h3>
            <p>{product.title}</p>
            <small>{product.location}</small>

            <div className="listing-actions">
              <button
                className="icon-btn"
                onClick={() => deleteProduct(product._id)}
              >
                🗑️
              </button>

              <Link to={`/edit-product/${product._id}`}>
                <button className="icon-btn">✏️</button>
              </Link>

              <button
                className="icon-btn"
                onClick={() => toggleStatus(product._id)}
              >
                {product.status === "active" ? "✓" : "⟳"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;