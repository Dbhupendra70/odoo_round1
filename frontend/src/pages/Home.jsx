

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api";
import "./Home.css"; // 👉 Add this line if using external CSS

export default function Home() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/items/approved").then((res) => setItems(res.data));
  }, []);

  const handleSwap = async (itemId, viaPoints) => {
    try {
      await axios.post("/swap/request", {
        item_id: itemId,
        via_points: viaPoints,
      });
      alert("Request sent successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Swap failed");
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">👕 ReWear – Browse Approved Items</h1>
      {items.length === 0 && <p className="no-items">No items found</p>}

      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <img src={item.image_url} alt={item.title} className="item-image" />
            <h3>{item.title}</h3>
            <p className="desc">{item.description}</p>
            <p>Size: {item.size} | Condition: {item.condition}</p>
            <p><strong>Tags:</strong> {item.tags}</p>
            <p>Status: {item.available ? "✅ Available" : "❌ Taken"}</p>

            {item.available && (
              <div className="button-group">
                <button className="btn primary" onClick={() => handleSwap(item.id, false)}>Swap Request</button>
                <button className="btn secondary" onClick={() => handleSwap(item.id, true)}>Redeem via Points</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}