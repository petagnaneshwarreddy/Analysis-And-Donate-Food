import "./App.css";
import React, { useState, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
// import Donation from "./pages/Donation";
import Inventory from "./pages/Inventory";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ECOProgress from "./pages/ECOProgress";
import Waste from "./pages/Waste";
import RecipeSearch from "./pages/RecipeSearch";
import NutritionAnalysis from "./pages/NutritionAnalysis";
import Display from "./pages/Display";
import Support from "./pages/support";
import HelpWidget from "./components/HelpWidget"; // ✅ Tawk.to live chat widget

import { AuthProvider, AuthContext } from "./AuthContext";

function PrivateRoute({ element }) {
  const { loggedIn } = useContext(AuthContext);
  return loggedIn ? element : <Navigate to="/login" />;
}

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
        {/* <Route path="/donation" element={<PrivateRoute element={<Donation />} />} /> */}
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipeSearch" element={<RecipeSearch />} />
        <Route
          path="/wasteAnalysis"
          element={<PrivateRoute element={<Waste onNewWaste={addNewWaste} />} />}
        />
        <Route path="/nutriAnalysis" element={<NutritionAnalysis />} />
        <Route path="/ecopro" element={<ECOProgress />} />
        <Route path="/display" element={<Display newWaste={wasteData} />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      <Footer />
      <HelpWidget /> {/* ✅ Injects Tawk.to live chat script */}
    </AuthProvider>
  );
}

export default App;
