import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/services";
const BASE_URL = "http://localhost:5000";

interface EditServiceProps {
  service: any;
  onClose: () => void;
  onUpdated: () => void;
}

const EditService: React.FC<EditServiceProps> = ({ service, onClose, onUpdated }) => {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      setError("Name and price are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (image) formData.append("image", image);

      await axios.put(`${API_BASE_URL}/${service._id}`, formData);
      onUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update service.");
    } finally {
      setLoading(false);
    }
  };

  // Overlay styles
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0 }}>Edit Service</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

          {/* Show existing image */}
          {service.image && !image && (
            <div>
              <p style={{ margin: "4px 0", fontSize: 13, color: "#555" }}>Current image:</p>
              <img
                src={`${BASE_URL}${service.image}`}
                alt="Current"
                style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 6 }}
              />
            </div>
          )}

          {/* New image preview */}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="New preview"
              style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 6 }}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "8px 0",
                backgroundColor: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "8px 0",
                backgroundColor: "#aaa",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;