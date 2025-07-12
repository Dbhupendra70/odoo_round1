import { useContext } from "react";
import { ItemContext } from "../context/ItemContext";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css"; // You can reuse the dashboard styling

export default function MyRequests() {
  const { items } = useContext(ItemContext);
  const { user } = useContext(AuthContext);

  const requestedItems = items.filter(
    (item) =>
      item.status !== "available" && item.requestedBy === user?.email
  );

  return (
    <div className="dashboard-container">
      <h2>My Swap / Redeem Requests</h2>
      {requestedItems.length === 0 ? (
        <p>You haven’t made any requests yet.</p>
      ) : (
        <div className="item-grid">
          {requestedItems.map((item, index) => (
            <div key={index} className="item-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p><strong>Size:</strong> {item.size}</p>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>Status:</strong> {item.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
