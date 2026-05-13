import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MyListings() {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMyListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/my/listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch listings");
    }
  };
  const toggleStatus = async (id) => {
  try {
    await axios.patch(`http://localhost:5000/api/products/${id}/status`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchMyListings();
  } catch (error) {
    toast.error(error.response?.data?.message || "Status update failed");
  }
};
  const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
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
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.title}
            />

            <h3>₹ {product.price}</h3>
            <p>{product.title}</p>
            <small>{product.location}</small>
            
            <button
  className="delete-listing-btn"
  onClick={() => deleteProduct(product._id)}
>
  Delete
</button>
<Link to={`/edit-product/${product._id}`}>
  <button className="edit-listing-btn">Edit</button>
</Link>
<p>Status: {product.status}</p>

<button
  className="status-btn"
  onClick={() => toggleStatus(product._id)}
>
  Mark as {product.status === "active" ? "Sold" : "Active"}
</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;