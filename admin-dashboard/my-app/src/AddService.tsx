import React, { useState, useRef } from "react";
import axios from "axios";

interface AddServiceProps {
  onServiceAdded: () => void;
}

const API_BASE_URL = "http://localhost:5000/api/services";

const AddService: React.FC<AddServiceProps> = ({ onServiceAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); 
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPrice = price.trim();

    // Debug: see exactly what the frontend thinks it has
    console.log("Submitting with:", { trimmedName, trimmedPrice, category });

    if (!trimmedName || !trimmedPrice || !category) {
      setError("Name, price and category are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("description", description);
      formData.append("price", trimmedPrice);
      formData.append("category", category);
      if (image) formData.append("image", image);

      // Debug: confirm what's actually in the FormData before sending
      for (const pair of formData.entries()) {
        console.log("FormData:", pair[0], pair[1]);
      }

      // IMPORTANT: do NOT manually set Content-Type here.
      // Letting axios/browser set it automatically ensures the
      // multipart boundary is included. If you have a global axios
      // instance elsewhere with `headers: { "Content-Type": "application/json" }`,
      // that will break this request — use plain `axios` here, not that instance.
      const res = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Success response:", res.data);

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onServiceAdded();
    } catch (err: any) {
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
      setError(err.response?.data?.message || "Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
      <h2>Add Service</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "" || /^\d*\.?\d*$/.test(val)) setPrice(val);
        }}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">-- Select category --</option>
        <option value="haircut">Hair Cut</option>
        <option value="haircolor">Hair Color</option>
        <option value="facial">Facial</option>
        <option value="makeup">Makeup</option>
        <option value="nailart">Nail Art</option>
        <option value="dressing">Dressing</option>
      </select>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }}
        />
      )}
      <button type="submit" disabled={loading}
     style={{ padding: "10px 20px", cursor: "pointer", background: "#b6055d", color: "#fff", border: "none", borderRadius: 6 }}>
        {loading ? "Adding..." : "Add Service"}
      </button>
    </form>
  );
};

export default AddService;