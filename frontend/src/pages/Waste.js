import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";

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

      // Clear form fields
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
            <div style={styles.card}>
              <h2 style={styles.heading}>Food Waste Details</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input type="text" value={foodItem} placeholder="Food Item" onChange={(e) => setFoodItem(e.target.value)} required style={styles.input} />
                <input type="number" value={foodQuantity} placeholder="Quantity Wasted (grams)" onChange={(e) => setFoodQuantity(e.target.value)} required style={styles.input} />
                <input type="text" value={foodReason} placeholder="Reason for Waste" onChange={(e) => setFoodReason(e.target.value)} required style={styles.input} />
                <input type="date" value={foodWasteDate} onChange={(e) => setFoodWasteDate(e.target.value)} required style={styles.input} />
                <input type="text" value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} required style={styles.input} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} style={styles.input} />

                <button type="submit" disabled={loading} style={styles.button}>
                  {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "ADD"}
                </button>
              </form>
            </div>

            {/* Waste Table */}
            <div style={styles.card}>
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

          {message && <p style={styles.message}>{message}</p>}
        </>
      ) : (
        <h2>Please log in to view Waste Analysis.</h2>
      )}
    </div>
  );
};

export default Waste;

// Styles Object
const styles = {
  page: { textAlign: "center", padding: "20px", background: "#121212", color: "white", minHeight: "100vh" },
  title: { fontSize: "2.5rem", fontWeight: "bold", color: "#ff4d6d", marginBottom: "20px" },
  content: { display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "30px", marginTop: "20px" },
  card: { background: "rgba(255, 255, 255, 0.1)", padding: "20px", borderRadius: "15px", width: "45%" },
  input: { width: "100%", padding: "10px", marginTop: "10px", borderRadius: "5px", border: "none", fontSize: "1rem" },
  button: { background: "#ff4d6d", color: "white", padding: "10px", borderRadius: "5px", border: "none", width: "100%" },
  deleteButton: { background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" },
  image: { width: "50px", height: "50px", objectFit: "cover" },
  tableContainer: { overflowX: "auto" },
};
