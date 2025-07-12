import { createContext, useState } from "react";

export const ItemContext = createContext();

export function ItemProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems([...items, { ...item, status: "available" }]); // ✅ default status
  };

  const updateItemStatus = (index, newStatus) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], status: newStatus };
    setItems(updatedItems); // ✅ update status
  };

  const value = {
    items,
    addItem,
    updateItemStatus, // ✅ exposed to components
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}
