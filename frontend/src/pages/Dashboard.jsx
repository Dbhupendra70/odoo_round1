import { useContext } from "react";
import { ItemContext } from "../context/ItemContext";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { items } = useContext(ItemContext);
  const { user } = useContext(AuthContext);

  const userItems = items.filter((item) => item.owner === user.email);

  return (
    <div className="dashboard-container">
      <h2>Your Listed Items</h2>
      {userItems.length === 0 ? (
        <p>You haven’t listed any items yet.</p>
        
      ) : (
        <div className="item-grid">
          {userItems.map((item, index) => (
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
