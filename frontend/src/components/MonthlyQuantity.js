import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Typography, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyQuantity = () => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlyQuantity, setMonthlyQuantity] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MONTHS = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  useEffect(() => {
    if (loggedIn) fetchMonthlyQuantity();
  }, [loggedIn]);

  const fetchMonthlyQuantity = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quantityByMonth = Array(12).fill(0);
      response.data.forEach((item) => {
        const monthIndex = new Date(item.itemPurchaseDate).getMonth();
        quantityByMonth[monthIndex] += item.itemQuantity;
      });

      setMonthlyQuantity(quantityByMonth);
    } catch (error) {
      console.error("❌ Error fetching monthly quantity:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Total Quantity Purchased (g)",
        data: monthlyQuantity,
        backgroundColor: "rgba(91, 233, 133, 1)",
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: {
        type: "category",
        grid: { color: "rgba(255,255,255, 0.2)", borderColor: "rgba(91, 233, 133, 1)" },
        ticks: { color: "white" },
      },
      y: {
        grid: { color: "rgba(255,255,255, 0.2)" },
        ticks: { color: "rgba(91, 233, 133, 1)" },
      },
    },
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {loggedIn ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "orange", mb: 2 }}>
            YOUR MONTHLY QUANTITY PURCHASED
          </Typography>

          {loading ? (
            <CircularProgress sx={{ mt: 3 }} />
          ) : error ? (
            <Typography sx={{ fontSize: "18px", fontWeight: "500", mt: "20px", color: "red" }}>
              {error}
            </Typography>
          ) : (
            <div style={{ width: "80%", height: "400px", margin: "auto" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </>
      ) : (
        <Typography sx={{ fontSize: "20px", fontWeight: "700", color: "darkSalmon", mt: "50px" }}>
          Please log in to view the monthly quantity purchased.
        </Typography>
      )}
    </div>
  );
};

export default MonthlyQuantity;