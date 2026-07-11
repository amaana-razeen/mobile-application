import axios from "axios";
import React, { useEffect, useState } from "react";

const API = "http://192.168.8.131:5000/api/recommended";

type RecommendedItem = {
  _id: string;
  name: string;
  image: string;
};

const RecommendedServices: React.FC = () => {
  const [name, setName]     = useState("");
  
  const [image, setImage]   = useState<File | null>(null);
  const [items, setItems]   = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API);
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!name || !image) {
      alert("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      setLoading(true);
      await axios.post(API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Added successfully!");
      setName("");
      setImage(null);
      fetchItems(); // Refresh list
    } catch (error: any) {
  console.log(error);
  console.log(error.response);

  alert(error.response?.data?.message || error.message);
}finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchItems();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Recommended Services</h2>

      {/* Add Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
        <input
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer", background: "#b6055d", color: "#fff", border: "none", borderRadius: 6 }}
        >
          {loading ? "Adding…" : "Add Recommended Service"}
        </button>
      </div>

      {/* Existing Items */}
      <h3>Current Recommendations ({items.length})</h3>
      {items.length === 0 ? (
        <p style={{ color: "#999" }}>No items yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  <img
                    src={`http://192.168.8.131:5000/uploads/${item.image}`}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/60"; }}
                  />
                </td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>
                  <button
              onClick={() => handleDelete(item._id)}
              style={{
                padding: "6px 14px",
                backgroundColor: "#e25454",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
};

export default RecommendedServices;