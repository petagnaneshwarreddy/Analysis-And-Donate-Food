import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Typography, CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlySpending = ({ newSpending }) => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlySpending, setMonthlySpending] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MONTHS = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  useEffect(() => {
    if (loggedIn) {
      fetchMonthlySpending();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (newSpending) {
      console.log("🔄 New spending recorded, updating chart:", newSpending);
      fetchMonthlySpending();
    }
  }, [newSpending]);

  const fetchMonthlySpending = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const spendingByMonth = Array(12).fill(0);
      response.data.forEach((item) => {
        const monthIndex = new Date(item.itemPurchaseDate).getMonth();
        spendingByMonth[monthIndex] += item.itemCost;
      });

      setMonthlySpending(spendingByMonth);
    } catch (error) {
      console.error("❌ Error fetching monthly spending:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Total Spendings in ₹",
        data: monthlySpending,
        backgroundColor: "rgba(233, 91, 133, 0.2)",
        borderColor: "rgba(233, 91, 133, 1)",
        borderWidth: 2,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(233, 91, 133, 1)",
        pointRadius: 5,
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
        grid: { color: "rgba(255,255,255, 0.2)" },
        ticks: { color: "white" },
      },
      y: {
        grid: { color: "rgba(255,255,255, 0.2)" },
        ticks: { color: "white" },
      },
    },
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {loggedIn ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "salmon" }}>
            YOUR MONTHLY SPENDINGS
          </Typography>

          {loading ? (
            <CircularProgress sx={{ mt: 3 }} />
          ) : error ? (
            <Typography sx={{ fontSize: "18px", fontWeight: "500", mt: "20px", color: "red" }}>
              {error}
            </Typography>
          ) : monthlySpending.some((spend) => spend > 0) ? (
            <div style={{ width: "80%", height: "400px", margin: "auto" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <Typography>No data available for monthly spending.</Typography>
          )}
        </>
      ) : (
        <Typography>Please log in to view the monthly spending.</Typography>
      )}
    </div>
  );
};

export default MonthlySpending;