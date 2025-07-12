
// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: '10px', background: '#eee' }}>
      <Link to="/">Home</Link> | 
      <Link to="/upload"> Upload</Link> | 
      <Link to="/signup"> Signup</Link> | 
      <Link to="/login"> Login</Link>  |  
      <Link to="/admin"> Admin Panel</Link>
    </nav>
  );
}