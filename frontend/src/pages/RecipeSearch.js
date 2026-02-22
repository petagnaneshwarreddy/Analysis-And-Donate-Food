import React, { useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://backend-food-analysis.onrender.com";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ingredients.trim()) {
      setErrorMessage("Please enter ingredients.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setRecipeList([]);

    try {
      const response = await axios.get(
        `${API_BASE}/api/recipes/search`,
        {
          params: {
            ingredients,
            diet: diet || undefined,
            cuisine: cuisineType || undefined,
          },
        }
      );

      if (response.data?.results?.length > 0) {
        setRecipeList(response.data.results);
      } else {
        setErrorMessage("No recipes found.");
      }
    } catch (error) {
      console.error("Recipe fetch error:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Error occurred while fetching recipes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background:
          'url("https://source.unsplash.com/1600x900/?food,cooking") no-repeat center center/cover',
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
        }}
      ></div>

      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          🍽️ Recipe Finder
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g. rice, chicken)"
            style={inputStyle}
          />

          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            style={inputStyle}
          >
            <option value="">Any Diet</option>
            <option value="balanced">Balanced</option>
            <option value="high-protein">High Protein</option>
            <option value="low-carb">Low Carb</option>
            <option value="low-fat">Low Fat</option>
            <option value="vegetarian">Vegetarian</option>
          </select>

          <input
            type="text"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            placeholder="Cuisine (e.g. Italian, Indian)"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Searching..." : "Search Recipes"}
          </button>
        </form>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            🔄 Loading recipes...
          </p>
        )}

        {errorMessage && (
          <p
            style={{
              color: "red",
              marginTop: "15px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </p>
        )}

        {recipeList.length > 0 && (
          <div style={{ marginTop: "25px" }}>
            {recipeList.map((recipe) => (
              <div key={recipe.id} style={cardStyle}>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={imageStyle}
                />

                <div style={{ marginLeft: "15px", flex: 1 }}>
                  <h3 style={{ marginBottom: "6px" }}>
                    {recipe.title}
                  </h3>

                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    View Full Recipe →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ===========================
   STYLES
=========================== */

const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#ff9800",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const cardStyle = {
  display: "flex",
  alignItems: "center",
  background: "#f9f9f9",
  borderRadius: "10px",
  padding: "12px",
  marginBottom: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const imageStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "8px",
  objectFit: "cover",
};

const linkStyle = {
  color: "#007bff",
  fontWeight: "bold",
  textDecoration: "none",
};

export default RecipeSearch;
