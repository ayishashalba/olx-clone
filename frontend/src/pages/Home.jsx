import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Home() {
  
  const [products, setProducts] = useState([]);
  const location = useLocation();

const searchQuery = new URLSearchParams(location.search).get("search") || "";

  const categories = [
    { name: "Cars", icon: "🚗" },
    { name: "Properties", icon: "🏢" },
    { name: "Mobiles", icon: "📱" },
    { name: "Furniture", icon: "🛋️" },
    { name: "Clothes", icon: "👕" }
  ];

  const fetchProducts = async (selectedCategory = "") => {
  const res = await axios.get(
    `http://localhost:5000/api/products?category=${selectedCategory}&search=${searchQuery}`
  );

  setProducts(res.data);
};

  useEffect(() => {
  fetchProducts();
}, [searchQuery]);

  return (
    <div className="home-page">
      <div className="category-grid">
        <button className="all-btn" onClick={() => fetchProducts()}>
  All Categories
</button>
        {categories.map((cat) => (
          <div
  className="category-card"
  key={cat.name}
  onClick={() => fetchProducts(cat.name)}
>
            <div className="category-icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <h1 className="fresh-title">Fresh recommendations</h1>

      <div className="product-grid">
        {products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            className="product-card"
            key={product._id}
          >
            <div className="heart">♡</div>

            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.title}
            />

            <h3>₹ {product.price}</h3>
            <p>{product.title}</p>
            <small>{product.location}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;