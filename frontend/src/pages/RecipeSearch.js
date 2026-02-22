import React, { useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://backend-food-analysis.onrender.com";

/* ===========================
   INJECT STYLES
=========================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rf-root {
    min-height: 100vh;
    background: #0e0c0a;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 60px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* Ambient blobs */
  .rf-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .rf-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,140,50,0.18) 0%, transparent 70%);
    top: -100px; left: -120px;
  }
  .rf-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(200,80,30,0.15) 0%, transparent 70%);
    bottom: -80px; right: -80px;
  }

  .rf-panel {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 680px;
  }

  /* Header */
  .rf-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .rf-eyebrow {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ff8c32;
    background: rgba(255,140,50,0.1);
    border: 1px solid rgba(255,140,50,0.25);
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 16px;
  }
  .rf-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(38px, 6vw, 56px);
    font-weight: 900;
    color: #f5ede0;
    line-height: 1.1;
    letter-spacing: -1px;
  }
  .rf-title span {
    color: #ff8c32;
  }
  .rf-subtitle {
    margin-top: 12px;
    font-size: 15px;
    color: rgba(245,237,224,0.45);
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  /* Card */
  .rf-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 36px;
    backdrop-filter: blur(12px);
  }

  /* Inputs */
  .rf-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(245,237,224,0.5);
    margin-bottom: 8px;
    margin-top: 20px;
  }
  .rf-label:first-child { margin-top: 0; }

  .rf-input, .rf-select {
    width: 100%;
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #f5ede0;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }
  .rf-input::placeholder { color: rgba(245,237,224,0.25); }
  .rf-input:focus, .rf-select:focus {
    border-color: rgba(255,140,50,0.6);
    background: rgba(255,140,50,0.06);
    box-shadow: 0 0 0 3px rgba(255,140,50,0.1);
  }

  .rf-select-wrap {
    position: relative;
  }
  .rf-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(245,237,224,0.4);
    pointer-events: none;
    font-size: 14px;
  }
  .rf-select option {
    background: #1a1510;
    color: #f5ede0;
  }

  .rf-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 480px) { .rf-row { grid-template-columns: 1fr; } }

  /* Button */
  .rf-btn {
    margin-top: 28px;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #ff8c32 0%, #e05a10 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.5px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(255,140,50,0.25);
  }
  .rf-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(255,140,50,0.38);
  }
  .rf-btn:active:not(:disabled) { transform: translateY(0); }
  .rf-btn:disabled { opacity: 0.55; cursor: default; }
  .rf-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  }

  /* Loading */
  .rf-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 28px;
    color: rgba(245,237,224,0.5);
    font-size: 14px;
  }
  .rf-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,140,50,0.2);
    border-top-color: #ff8c32;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Error */
  .rf-error {
    margin-top: 20px;
    padding: 14px 16px;
    background: rgba(220,50,50,0.1);
    border: 1px solid rgba(220,50,50,0.25);
    border-radius: 10px;
    color: #ff7070;
    font-size: 14px;
    text-align: center;
  }

  /* Results */
  .rf-results {
    margin-top: 32px;
  }
  .rf-results-heading {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: #f5ede0;
    margin-bottom: 16px;
    font-weight: 700;
  }
  .rf-results-heading span {
    color: #ff8c32;
  }

  .rf-recipe-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 12px;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    cursor: default;
  }
  .rf-recipe-card:hover {
    border-color: rgba(255,140,50,0.3);
    background: rgba(255,140,50,0.05);
    transform: translateX(4px);
  }

  .rf-recipe-img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .rf-recipe-info { flex: 1; min-width: 0; }
  .rf-recipe-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: #f5ede0;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rf-recipe-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #ff8c32;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.3px;
    transition: gap 0.2s, opacity 0.2s;
  }
  .rf-recipe-link:hover { gap: 8px; opacity: 0.85; }

  .rf-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 28px 0 0;
  }
`;

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
      const response = await axios.get(`${API_BASE}/api/recipes/search`, {
        params: {
          ingredients,
          diet: diet || undefined,
          cuisine: cuisineType || undefined,
        },
      });

      if (response.data?.results?.length > 0) {
        setRecipeList(response.data.results);
      } else {
        setErrorMessage("No recipes found.");
      }
    } catch (error) {
      console.error("Recipe fetch error:", error);
      setErrorMessage(
        error.response?.data?.error || "Error occurred while fetching recipes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rf-root">
        <div className="rf-blob rf-blob-1" />
        <div className="rf-blob rf-blob-2" />

        <div className="rf-panel">
          {/* Header */}
          <div className="rf-header">
            <div className="rf-eyebrow">✦ Culinary Discovery</div>
            <h1 className="rf-title">
              Find Your Next<br /><span>Perfect Recipe</span>
            </h1>
            <p className="rf-subtitle">
              Enter what you have — we'll find what to make
            </p>
          </div>

          {/* Form card */}
          <div className="rf-card">
            <form onSubmit={handleSubmit}>
              <label className="rf-label">Ingredients</label>
              <input
                className="rf-input"
                type="text"
                required
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. chicken, rice, garlic…"
              />

              <div className="rf-row">
                <div>
                  <label className="rf-label">Diet</label>
                  <div className="rf-select-wrap">
                    <select
                      className="rf-select"
                      value={diet}
                      onChange={(e) => setDiet(e.target.value)}
                    >
                      <option value="">Any Diet</option>
                      <option value="balanced">Balanced</option>
                      <option value="high-protein">High Protein</option>
                      <option value="low-carb">Low Carb</option>
                      <option value="low-fat">Low Fat</option>
                      <option value="vegetarian">Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="rf-label">Cuisine</label>
                  <input
                    className="rf-input"
                    type="text"
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                    placeholder="e.g. Italian, Indian…"
                  />
                </div>
              </div>

              <button className="rf-btn" type="submit" disabled={loading}>
                {loading ? "Searching…" : "Search Recipes →"}
              </button>
            </form>

            {loading && (
              <div className="rf-loading">
                <div className="rf-spinner" />
                Finding the best recipes for you…
              </div>
            )}

            {errorMessage && (
              <div className="rf-error">{errorMessage}</div>
            )}

            {recipeList.length > 0 && (
              <>
                <div className="rf-divider" />
                <div className="rf-results">
                  <p className="rf-results-heading">
                    <span>{recipeList.length}</span> recipes found
                  </p>
                  {recipeList.map((recipe) => (
                    <div key={recipe.id} className="rf-recipe-card">
                      <img
                        className="rf-recipe-img"
                        src={recipe.image}
                        alt={recipe.title}
                      />
                      <div className="rf-recipe-info">
                        <div className="rf-recipe-title">{recipe.title}</div>
                        <a
                          className="rf-recipe-link"
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Full Recipe →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeSearch;
