import "./App.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Donation from "./pages/Donation";
import Inventory from "./pages/Inventory";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { AuthProvider } from "./AuthContext";
import ECOProgress from "./pages/ECOProgress";
import Waste from "./pages/Waste";
import RecipeSearch from "./pages/RecipeSearch";
import NutritionAnalysis from "./pages/NutritionAnalysis";
import Display from "./pages/Display";
// import Main from "./pages/Main"; // ✅ Added Future Extension (Main.js)

function App() {
  const [wasteData, setWasteData] = useState([]);

  const addNewWaste = (newWaste) => {
    setWasteData((prevData) => [newWaste, ...prevData]);
  };

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recipeSearch" element={<RecipeSearch />} />
        <Route path="/wasteAnalysis" element={<Waste onNewWaste={addNewWaste} />} />
        <Route path="/nutriAnalysis" element={<NutritionAnalysis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ecopro" element={<ECOProgress />} />
        <Route path="/display" element={<Display newWaste={wasteData} />} />
        {/* <Route path="/mains" element={<Main />} /> ✅ Fixed Missing Route */}
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
