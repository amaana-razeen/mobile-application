import axios from "axios";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

const API_URL = "http://localhost:5000/api/bookings";

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all bookings
const loadBookings = async () => {
  try {
    const response = await axios.get(API_URL);

    console.log(response.data);

    setBookings(response.data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    setLoading(false);
  }
};

  // Update booking status
  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        status,
      });

      loadBookings();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      alert("Appointment deleted successfully.");

      loadBookings();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete appointment.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Appointments Dashboard</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table
          border={2}
          cellPadding={10}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead style={{backgroundColor: '#b6055d'}}>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody style={{backgroundColor: '#fabddb'}}>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.customerName}</td>
                <td>{booking.email}</td>
                <td>{booking.phone}</td>
                <td>{booking.service}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.status}</td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select  style={{backgroundColor: '#f8b7cd'}}
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(
                          booking._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => deleteBooking(booking._id)}
                      style={{
                        backgroundColor: "#b60516",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}