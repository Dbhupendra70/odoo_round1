import { useContext } from "react";
import { ItemContext } from "../context/ItemContext";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { items, updateItemStatus } = useContext(ItemContext);
  const { isAuthenticated } = useContext(AuthContext);

  const handleSwap = (index) => {
  updateItemStatus(index, {
    status: "requested",
    requestedBy: user?.email, // Track who requested
  });
  alert("Swap request sent!");
};

const handleRedeem = (index) => {
  updateItemStatus(index, {
    status: "redeemed",
    requestedBy: user?.email,
  });
  alert("Item redeemed via points!");
};


  return (
    <div className="home-container">
      <h2>Available Items</h2>
      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div className="item-grid">
          {items.map((item, index) => (
            <div key={index} className="item-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p><strong>Size:</strong> {item.size}</p>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>Status:</strong> {item.status}</p>

              {isAuthenticated && item.status === "available" && (
                <div className="item-actions">
                  <button onClick={() => handleSwap(index)}>Request Swap</button>
                  <button onClick={() => handleRedeem(index)}>Redeem via Points</button>
                </div>
              )}

              {item.status !== "available" && (
                <p className="unavailable">This item is no longer available.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
