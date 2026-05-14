import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  const handleSearch = () => {
    navigate(`/?search=${search}`);
  };

  return (
    <nav className="olx-navbar">
      <Link to="/" className="olx-logo">
        olx
      </Link>

      <input
        className="nav-search"
        type="text"
        placeholder='Search "Properties"'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="search-btn" onClick={handleSearch}>
        🔍
      </button>

      {!user ? (
        <>
          <Link to="/login" className="nav-link">
            Login
          </Link>

          <Link to="/register" className="nav-link">
            Register
          </Link>

          <Link to="/login" className="sell-btn">
            + SELL
          </Link>
        </>
      ) : (
        <>
          {(user.role === "seller" || user.role === "admin") && (
            <Link to="/my-listings" className="nav-link">
              My Listings
            </Link>
          )}

          {user.role === "admin" && (
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          )}

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>

          {user.role === "buyer" && (
  <Link to="/become-seller" className="sell-btn">
    + SELL
  </Link>
)}

{(user.role === "seller" || user.role === "admin") && (
  <Link to="/post-ad" className="sell-btn">
    + SELL
  </Link>
          )}
        </>
      )}
    </nav>
  );
}

export default Navbar;