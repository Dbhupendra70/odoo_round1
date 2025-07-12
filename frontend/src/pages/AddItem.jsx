import "./AddItem.css";
import { useState, useContext } from "react";
import { ItemContext } from "../context/ItemContext";
import { AuthContext } from "../context/AuthContext";

export default function AddItem() {
  const { addItem } = useContext(ItemContext);
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItem({ ...item, image: imageUrl });
      setPreview(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.image) {
      alert("Please upload an image.");
      return;
    }
    addItem({ ...item, owner: user.email });
    alert("Item submitted!");

    // Reset form
    setItem({
      title: "",
      description: "",
      category: "",
      size: "",
      condition: "",
      image: "",
    });
    setPreview(null);
  };

  return (
    <div className="add-item-container">
      <h2>List a New Item</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} value={item.title} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} value={item.description} required />
        <input name="category" placeholder="Category" onChange={handleChange} value={item.category} required />
        <input name="size" placeholder="Size" onChange={handleChange} value={item.size} required />
        <input name="condition" placeholder="Condition" onChange={handleChange} value={item.condition} required />

        {/* 👇 Image upload and preview */}
        <input type="file" accept="image/*" onChange={handleImageUpload} required />
        {preview && <img src={preview} alt="Preview" className="image-preview" />}

        <button type="submit">Submit Item</button>
      </form>
    </div>
  );
}
