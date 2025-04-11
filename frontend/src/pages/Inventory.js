import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Typography, CircularProgress } from "@mui/material";

const Inventory = () => {
  const { loggedIn } = useContext(AuthContext);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemPurchaseDate, setItemPurchaseDate] = useState("");
  const [itemExpiryDate, setItemExpiryDate] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loggedIn) fetchInventoryData();
  }, [loggedIn]);

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInventoryData(response.data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  // Add item to inventory
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const newItem = { itemName, itemQuantity, itemCost, itemPurchaseDate, itemExpiryDate };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ You must be logged in.");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/inventory", newItem, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setMessage("✅ Item added successfully!");
      setInventoryData([...inventoryData, response.data.data]); // Update UI with new item

      // Reset form fields
      setItemName("");
      setItemQuantity("");
      setItemCost("");
      setItemPurchaseDate("");
      setItemExpiryDate("");
    } catch (error) {
      setMessage("❌ Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  // Delete item from inventory
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`http://localhost:5000/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove item from UI
      setInventoryData(inventoryData.filter((item) => item._id !== id));
      setMessage("✅ Item deleted successfully!");
    } catch (error) {
      setMessage("❌ Failed to delete item.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontSize: "1.2rem" }}>
      {loggedIn ? (
        <>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#ff6b6b" }}>
            YOUR <span style={{ color: "#ff4757" }}>INVENTORY</span>
          </h1>

          <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "50px",
            marginTop: "30px"
          }}>
            {/* Form Section */}
            <div style={{
              background: "white",
              padding: "50px",
              borderRadius: "15px",
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
              width: "500px"
            }}>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={itemName}
                  placeholder="Item Name"
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="number"
                  value={itemQuantity}
                  placeholder="Quantity (g)"
                  onChange={(e) => setItemQuantity(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="number"
                  value={itemCost}
                  placeholder="Cost (₹)"
                  onChange={(e) => setItemCost(e.target.value)}
                  required
                  style={styles.input}
                />
                <label style={styles.label}>Purchase Date:</label>
                <input
                  type="date"
                  value={itemPurchaseDate}
                  onChange={(e) => setItemPurchaseDate(e.target.value)}
                  required
                  style={styles.input}
                />
                <label style={styles.label}>Expiry Date:</label>
                <input
                  type="date"
                  value={itemExpiryDate}
                  onChange={(e) => setItemExpiryDate(e.target.value)}
                  required
                  style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Add Item"}
                </button>
              </form>
            </div>

            {/* Table Section */}
            <div style={{ maxWidth: "1000px", overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Item Name</th>
                    <th>Quantity (g)</th>
                    <th>Cost (₹)</th>
                    <th>Purchase Date</th>
                    <th>Expiry Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.length > 0 ? (
                    inventoryData.map((item) => (
                      <tr key={item._id} style={styles.tableRow}>
                        <td>{item.itemName}</td>
                        <td>{item.itemQuantity}</td>
                        <td>₹{item.itemCost.toFixed(2)}</td>
                        <td>{new Date(item.itemPurchaseDate).toLocaleDateString()}</td>
                        <td>{new Date(item.itemExpiryDate).toLocaleDateString()}</td>
                        <td>
                          <button style={styles.deleteButton} onClick={() => handleDelete(item._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={styles.noData}>No items in inventory.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Message Display */}
          {message && <p style={{ color: message.includes("✅") ? "#4caf50" : "#ff4d6d" }}>{message}</p>}
        </>
      ) : (
        <Typography>Please log in to view the Inventory.</Typography>
      )}
    </div>
  );
};

export default Inventory;

// Styles
const styles = {
  input: { width: "100%", padding: "15px", marginBottom: "15px", borderRadius: "10px", border: "2px solid #ccc" },
  label: { fontSize: "1.4rem", fontWeight: "bold" },
  button: { width: "100%", padding: "15px", background: "#6c5ce7", color: "white", borderRadius: "10px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "15px", fontSize: "1.3rem" },
  tableHeader: { backgroundColor: "#ff6b6b", color: "white" },
  tableRow: { background: "#ffd166", fontSize: "1.2rem" },
  deleteButton: { background: "#e74c3c", color: "white", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" },
  noData: { textAlign: "center", padding: "15px" },
};
