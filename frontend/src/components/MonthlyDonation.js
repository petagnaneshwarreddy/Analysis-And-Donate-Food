import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Typography, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteAnalysis = ({ newWaste }) => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlyWaste, setMonthlyWaste] = useState(Array(12).fill(0));
  const [dailyWaste, setDailyWaste] = useState(Array(31).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MONTHS = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  useEffect(() => {
    if (loggedIn) fetchWasteData();
  }, [loggedIn]);

  useEffect(() => {
    if (newWaste) fetchWasteData();
  }, [newWaste]);

  const fetchWasteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const wasteByMonth = Array(12).fill(0);
      const wasteByDay = Array(31).fill(0);
      const currentMonth = new Date().getMonth();

      response.data.forEach((item) => {
        const wasteDate = new Date(item.foodWasteDate);
        wasteByMonth[wasteDate.getMonth()] += item.foodQuantity;
        if (wasteDate.getMonth() === currentMonth) {
          wasteByDay[wasteDate.getDate() - 1] += item.foodQuantity;
        }
      });

      setMonthlyWaste(wasteByMonth);
      setDailyWaste(wasteByDay);
    } catch (error) {
      console.error("❌ Error fetching waste data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
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
        grid: { color: "rgba(255,255,255, 0.2)", borderColor: "rgba(233, 91, 133, 1)" },
        ticks: { color: "white" },
      },
      y: {
        grid: { color: "rgba(255,255,255, 0.2)" },
        ticks: { color: "rgba(233, 91, 133, 1)" },
      },
    },
  };

  return (
    <div className="waste-analysis-container" style={{ padding: "20px", textAlign: "center" }}>
      {loggedIn ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#d32f2f", mb: 2 }}>
            YOUR <span style={{ color: "salmon" }}>WASTE ANALYSIS</span>
          </Typography>

          {loading ? (
            <CircularProgress sx={{ mt: 3 }} />
          ) : error ? (
            <Typography sx={{ fontSize: "18px", fontWeight: "500", mt: "20px", color: "red" }}>
              {error}
            </Typography>
          ) : (
            <>
              <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: "bold", color: "#e95b85" }}>
                Monthly Waste Summary 📊
              </Typography>
              <div style={{ width: "80%", height: "400px", margin: "auto" }}>
                <Bar data={{ labels: MONTHS, datasets: [{ label: "Total Waste (g)", data: monthlyWaste, backgroundColor: "rgba(233, 91, 133, 1)", borderColor: "#ffffff", borderWidth: 1 }] }} options={chartOptions} />
              </div>

              <Typography variant="h5" sx={{ mt: 5, mb: 1, fontWeight: "bold", color: "#5b9be9" }}>
                Daily Waste in {MONTHS[new Date().getMonth()]} 📅
              </Typography>
              <div style={{ width: "80%", height: "400px", margin: "auto" }}>
                <Bar data={{ labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`), datasets: [{ label: "Daily Waste (g)", data: dailyWaste, backgroundColor: "rgba(91, 155, 233, 1)", borderColor: "#ffffff", borderWidth: 1 }] }} options={chartOptions} />
              </div>
            </>
          )}
        </>
      ) : (
        <Typography sx={{ fontSize: "20px", fontWeight: "700", color: "darkSalmon", mt: "50px" }}>
          Please log in to view waste analysis.
        </Typography>
      )}
    </div>
  );
};

export default WasteAnalysis;