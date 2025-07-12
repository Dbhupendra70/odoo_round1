import { useEffect, useState } from "react";
import axios from "../api";

export default function AdminPanel() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("/admin/pending-items")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.detail || "Failed to load pending items");
      });
  }, []);

  const approveItem = async (id) => {
    try {
      await axios.post(`/approve/${id}`);
      setItems(items.filter(item => item.id !== id)); // remove after approval
    } catch (error) {
      console.error("Approval failed", error);
      alert("Failed to approve item");
    }
  };

  return (
    <div>
      <h2>Pending Items (Admin Only)</h2>
      {items.length === 0 && <p>No pending items</p>}
      {items.map((item) => (
        <div key={item.id} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          <button onClick={() => approveItem(item.id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}