import React, { useState } from "react";
import axios from "axios";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
        params: {
          apiKey: "596845cfd0f14b57801f9b5b1e08bbfe", // Replace with your actual API key
          query: ingredients,
          diet: diet || undefined, 
          cuisine: cuisineType || undefined, 
          number: 10, 
          addRecipeInformation: true, 
        },
      });

      if (response.data.results.length > 0) {
        setRecipeList(response.data.results);
        setErrorMessage("");
      } else {
        setRecipeList([]);
        setErrorMessage("No recipes found.");
      }
    } catch (error) {
      setRecipeList([]);
      setErrorMessage("Error occurred during API request.");
    }
  };

  return (
    <div style={{
      background: `url("https://source.unsplash.com/1600x900/?food,recipes") no-repeat center center/cover`,
      minHeight: "100vh",
      padding: "50px 20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
      position: "relative",
    }}>
      {/* Overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
      }}></div>

      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 10,
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#444",
          textAlign: "center",
          marginBottom: "20px",
        }}>
          🍽️ Recipe Finder
        </h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            required
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g. chicken, rice)"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
          />

          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
              background: "#fff",
            }}
          >
            <option value="">Any Diet</option>
            <option value="balanced">Balanced</option>
            <option value="high-protein">High Protein</option>
            <option value="low-carb">Low Carb</option>
            <option value="low-fat">Low Fat</option>
          </select>

          <input
            type="text"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            placeholder="Cuisine Type (e.g. Italian, Mexican)"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
          />

          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            background: "#ff9800",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}>
            Search Recipes
          </button>
        </form>

        {recipeList.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            {recipeList.map((recipe) => (
              <div key={recipe.id} style={{
                display: "flex",
                alignItems: "center",
                background: "#f9f9f9",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}>
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }} 
                />
                <div style={{ flex: 1, marginLeft: "15px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#333" }}>{recipe.title}</h3>
                  <p style={{ fontSize: "0.9rem", margin: "5px 0" }}>
                    🔗 <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" 
                      style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                      View Full Recipe
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            marginTop: "20px",
            fontSize: "1rem",
            fontWeight: "bold",
            color: errorMessage ? "#d9534f" : "#333",
            textAlign: "center",
          }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
