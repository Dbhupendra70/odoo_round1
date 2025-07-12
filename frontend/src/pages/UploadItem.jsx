import { useState } from "react";
import axios from "../api";

export default function UploadItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    image_url: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/items/upload", form);
      alert("Item uploaded! Awaiting admin approval.");
      setForm({
        title: "", description: "", category: "",
        type: "", size: "", condition: "", tags: "", image_url: ""
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload New Item</h2>
      {Object.keys(form).map((key) => (
        <div key={key}>
          <input
            name={key}
            value={form[key]}
            placeholder={key}
            onChange={handleChange}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
}