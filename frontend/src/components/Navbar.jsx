import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
  <nav className="navbar">
    <h2 className="logo">ReWear 👕</h2>
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      {!isAuthenticated && (
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </>
      )}
      {isAuthenticated && (
        <>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/add-item">List Item</Link></li> 
          <li><Link to="/my-requests">My Requests</Link></li>{/* ✅ Add this */}
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      )}
    </ul>
  </nav>
);

}
