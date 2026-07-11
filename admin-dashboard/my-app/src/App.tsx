import React, { useState } from "react";
import AddService from "./AddService";
import ServiceList from "./ServiceList";
import RecommendedServices from "./RecommendedServices";
import Booking from "./Booking";

const App: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState("services");

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setPage("services")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            color: "#b6055d",
          }}
        >
          Services
        </button>

        <button
          onClick={() => setPage("recommended")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            color: "#b6055d",
          }}
        >
          Recommended Services
        </button>

        <button
          onClick={() => setPage("bookings")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          color: "#b6055d",
          }}
        >
          Bookings
        </button>
      </div>

      {/* Services Page */}
      {page === "services" && (
        <>
          <AddService onServiceAdded={handleRefresh} />
          <ServiceList refresh={refresh} />
        </>
      )}

      {/* Recommended Services Page */}
      {page === "recommended" && (
        <RecommendedServices />
      )}

      {/* Bookings Page */}
      {page === "bookings" && (
        <Booking />
      )}
    </div>
  );
};

export default App;