import React, { useState } from "react";
import AddService from "./AddService";
import ServiceList from "./ServiceList";

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <AddService onServiceAdded={() => setRefreshKey((k) => k + 1)} />
      <ServiceList refreshKey={refreshKey} />
    </div>
  );
};

export default App;