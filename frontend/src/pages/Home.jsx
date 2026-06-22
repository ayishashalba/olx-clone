import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  const categories = [
    { name: "Cars", icon: "🚗" },
    { name: "Properties", icon: "🏢" },
    { name: "Mobiles", icon: "📱" },
    { name: "Furniture", icon: "🛋️" },
    { name: "Clothes", icon: "👕" },
    { name: "Others", icon: "📦" }
  ];

 const fetchProducts = async (
  category = selectedCategory,
  selectedSort = sort
) => {
  const apiCategory = category === "Others" ? "" : category;

  const res = await axios.get(
    `https://olx-clone-zg79.onrender.com/api/products?category=${apiCategory}&search=${searchQuery}&sort=${selectedSort}`
  );

  let data = res.data;
console.log("Products:", data);
  if (category === "Others") {
    const mainCategories = [
      "Cars",
      "Properties",
      "Mobiles",
      "Furniture",
      "Clothes",
    ];

    data = data.filter(
      (product) => !mainCategories.includes(product.category)
    );
  }

  setProducts(data);
};

  const toggleWishlist = (e, productId) => {
    e.preventDefault();

    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="home-page">
      <div className="category-grid">
        <button
          className="all-btn"
          onClick={() => {
            setSelectedCategory("");
            fetchProducts("", sort);
          }}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <div
            className="category-card"
            key={cat.name}
            onClick={() => {
              setSelectedCategory(cat.name);
              fetchProducts(cat.name, sort);
            }}
          >
            <div className="category-icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <h1 className="fresh-title">Fresh recommendations</h1>

      <div className="filters">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            fetchProducts(selectedCategory, e.target.value);
          }}
        >
          <option value="">Newest</option>
          <option value="high">Price: High to Low</option>
          <option value="low">Price: Low to High</option>
        </select>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
  <div style={{ textAlign: "center", fontSize: "24px" }}>
    No products found
  </div>
) : (products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            className="product-card"
            key={product._id}
          >
            <div
              className="heart"
              onClick={(e) => toggleWishlist(e, product._id)}
            >
              {wishlist.includes(product._id) ? "♥" : "♡"}
            </div>

            <div className="home-image-wrapper">
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
          </Link>
        ))
      )}
      </div>
    </div>
  );
}

export default Home;