import React, { useEffect, useState } from "react";
import axios from "axios";
import EditService from "./EditService";

const API_BASE_URL = "http://localhost:5000/api/services";
const BASE_URL = "http://localhost:5000";

const ServiceList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchServices(); // refresh list after delete
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete service.");
    }
  };

  return (
    <div>
      <h2>Services</h2>

      {/* Edit modal/overlay */}
      {editingService && (
        <EditService
          service={editingService}
          onClose={() => setEditingService(null)}
          onUpdated={() => {
            setEditingService(null);
            fetchServices();
          }}
        />
      )}

      {services.map((s: any) => (
        <div
          key={s._id}
          style={{ marginBottom: 20, borderBottom: "1px solid #ccc", paddingBottom: 10 }}
        >
          {s.image && (
            <img
              src={`${BASE_URL}${s.image}`}
              alt={s.name}
              style={{ width: 50, maxHeight: 50, objectFit: "cover", borderRadius: 8 }}
            />
          )}

          <h3>{s.name}</h3>
          <p>{s.description}</p>
          <p>{s.price}</p>

          {/* ✅ Edit and Delete buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              onClick={() => setEditingService(s)}
              style={{
                padding: "6px 14px",
                backgroundColor: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(s._id)}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;