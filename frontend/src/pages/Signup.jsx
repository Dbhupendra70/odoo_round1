// src/pages/Signup.jsx
import { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/signup", { email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
        console.log(error.response);
        
      alert(error.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}