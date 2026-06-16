import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://olx-clone-zg79.onrender.com/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) {
    return <h1>Loading...</h1>;
  }
const words = product.description.trim().split(/\s+/);
console.log("Words:", words.length);
  return (
    <div className="details-page">
      <div className="details-card">
        <img
          src={`https://olx-clone-zg79.onrender.com/uploads/${product.image}`}
          alt={product.title}
        />

        <div className="details-info">
          <h1>₹ {product.price}</h1>
          <h2>{product.title}</h2>
          <h4>Words Count: {words.length}</h4>
          <p>
  {showFullDescription
    ? product.description
    : words.slice(0, 10).join(" ") +
      (words.length > 10 ? "..." : "")}
</p>

{words.length > 10 && (
  <span
    className="read-more"
    onClick={() => setShowFullDescription(!showFullDescription)}
  >
    {showFullDescription ? "Show less" : "Read more"}
  </span>
)}

          <h3>Category: {product.category}</h3>
          <h3>Location: {product.location}</h3>

          <div className="seller-box">
            <h2>Seller Details</h2>
            <p>Name: {product.seller?.name}</p>
            <p>Email: {product.seller?.email}</p>
            <a
  className="contact-btn"
  href={`mailto:${product.seller?.email}`}
>
  Contact Seller
</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;