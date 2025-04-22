import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";

// Keep imports the same

const Waste = () => {
  const { loggedIn } = useContext(AuthContext);
  const [foodItem, setFoodItem] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodReason, setFoodReason] = useState("");
  const [foodWasteDate, setFoodWasteDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loggedIn) fetchWasteData();
  }, [loggedIn]);

  const fetchWasteData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWasteData(response.data);
    } catch (error) {
      console.error("Error fetching waste data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ You must be logged in.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("foodItem", foodItem);
      formData.append("foodQuantity", foodQuantity);
      formData.append("foodReason", foodReason);
      formData.append("foodWasteDate", foodWasteDate);
      formData.append("location", location);
      if (image) formData.append("image", image);

      const response = await axios.post("http://localhost:5000/waste", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Waste item added successfully!");
      setWasteData([...wasteData, response.data.data]);

      // Clear form
      setFoodItem("");
      setFoodQuantity("");
      setFoodReason("");
      setFoodWasteDate("");
      setLocation("");
      setImage(null);
    } catch (error) {
      setMessage("❌ Failed to add waste item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ You must be logged in.");
        return;
      }

      await axios.delete(`http://localhost:5000/waste/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWasteData(wasteData.filter((item) => item._id !== id));
      alert("✅ Waste item deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete waste item.");
    }
  };

  return (
    <div style={styles.page}>
      {loggedIn ? (
        <>
          <h1 style={styles.title}>LOG YOUR FOOD WASTE</h1>
          <div style={styles.content}>
            {/* Waste Form */}
            <div style={styles.card} className="fadeIn">
              <h2 style={styles.heading}>Food Waste Details</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input style={styles.input} placeholder="Food Item" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} required />
                <input style={styles.input} placeholder="Quantity Wasted (grams)" type="number" value={foodQuantity} onChange={(e) => setFoodQuantity(e.target.value)} required />
                <input style={styles.input} placeholder="Reason for Waste" value={foodReason} onChange={(e) => setFoodReason(e.target.value)} required />
                <input style={styles.input} type="date" value={foodWasteDate} onChange={(e) => setFoodWasteDate(e.target.value)} required />
                <input style={styles.input} placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                <input style={styles.input} type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit" disabled={loading} style={styles.button}>
                  {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "ADD"}
                </button>
              </form>
            </div>

            {/* Waste Table */}
            <div style={styles.card} className="fadeIn">
              <h2 style={styles.heading}>Your Food Waste Records</h2>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Quantity (g)</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteData.map((item) => (
                      <tr key={item._id}>
                        <td>{item.foodItem}</td>
                        <td>{item.foodQuantity}</td>
                        <td>{item.foodReason}</td>
                        <td>{item.foodWasteDate}</td>
                        <td>{item.location}</td>
                        <td>
                          {item.image && (
                            <img src={`http://localhost:5000/uploads/${item.image}`} alt="Food Waste" style={styles.image} />
                          )}
                        </td>
                        <td>
                          <button style={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Please log in to access this page.</p>
      )}
    </div>
  );
};

const styles = {
  page: {
    margin: "0 auto",
    padding: "20px",
    maxWidth: "800px",
    animation: "fadeIn 1s ease-in-out",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    background: "#f9f9f9",
    transition: "transform 0.3s ease",
  },
  heading: {
    fontSize: "1.4rem",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "transform 0.2s ease-in-out, background-color 0.2s",
  },
  deleteButton: {
    padding: "10px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.2s ease-in-out, background-color 0.2s",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  image: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "5px",
  },
};

// Optional: Add this CSS to index.css or global styles
// Add this in your CSS file or <style> tag:
/*
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.fadeIn {
  animation: fadeIn 0.8s ease;
}
button:hover {
  transform: scale(1.05);
}
*/

export default Waste;
