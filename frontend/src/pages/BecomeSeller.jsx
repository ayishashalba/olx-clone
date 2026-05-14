import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BecomeSeller() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleBecomeSeller = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/auth/become-seller",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message);
      navigate("/post-ad");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to become seller");
    }
  };

  if (!user) {
    return <h1>Please login first</h1>;
  }

  return (
    <div className="form-container">
      <h1>Become a Seller</h1>

      <div className="seller-box">
        <p>
          To post ads and manage your listings, upgrade your account to seller.
        </p>

        <button onClick={handleBecomeSeller}>
          Become Seller
        </button>
      </div>
    </div>
  );
}

export default BecomeSeller;