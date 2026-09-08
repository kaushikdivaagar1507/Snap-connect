import React, { useState, useEffect } from "react";
import { getPhotographers } from "../api/api";

const CATEGORIES = [
  "ALL",
  "WEDDING",
  "PRE_WEDDING",
  "PORTRAIT",
  "FASHION",
  "EVENT",
  "NATURE"
];

const Explore = ({ onBack, onSelectPhotographer }) => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState("");

  const token = localStorage.getItem("token");
  
  // Check user role from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isPhotographer = user.role === "PHOTOGRAPHER";

  const fetchPhotographers = async () => {
    setLoading(true);
    try {
      // Build clean filter object
      const filters = {};
      
      if (search.trim()) filters.search = search.trim();
      if (location.trim()) filters.location = location.trim();
      if (category !== "ALL") filters.specialization = category;
      if (maxPrice) filters.maxPrice = Number(maxPrice); // Ensure it's a number

      const data = await getPhotographers(token, filters);
      
      // Support both array responses or object wrapped responses ({ photographers: [] })
      if (Array.isArray(data)) {
        setPhotographers(data);
      } else {
        setPhotographers(data.photographers || []);
      }
    } catch (error) {
      console.error("Failed to fetch photographers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically when component loads or filters change
useEffect(() => {
    const timer = setTimeout(() => {
        // Run fetch if token exists
        if (token) {
            fetchPhotographers();
        }
    }, 300);

    return () => clearTimeout(timer);
}, [search, location, category, maxPrice, token]);

  // Block access for Photographer account types
  if (isPhotographer) {
    return (
      <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center", color: "#fff", fontFamily: "sans-serif" }}>
        <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>Access Restricted 🚫</h2>
        <p style={{ color: "#a8a8a8", marginBottom: "24px" }}>
          The Explore Directory is designed for clients looking to hire photographers.
        </p>
        <button 
          onClick={onBack}
          style={{
            background: "#0095f6",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px", color: "#fff", fontFamily: "sans-serif" }}>
      
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <button 
          onClick={onBack}
          style={{
            background: "#262626",
            color: "#fff",
            border: "1px solid #363636",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          ← Back to Feed
        </button>
      </div>

      {/* Hero Title */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0" }}>
          Find Your Perfect Photographer 📸
        </h1>
        <p style={{ color: "#a8a8a8", margin: 0, fontSize: "14px" }}>
          Discover top creators by name, location, photography style, and pricing.
        </p>
      </div>

      {/* Filter Inputs Container */}
      <div style={{ 
        background: "#121212", 
        border: "1px solid #262626", 
        borderRadius: "12px", 
        padding: "16px", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
        gap: "12px", 
        marginBottom: "24px" 
      }}>
        <input
          type="text"
          placeholder="🔍 Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="📍 Filter by city (e.g. Chennai)..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="💳 Max Budget (₹)..."
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: isActive ? "#0095f6" : "#121212",
                color: isActive ? "#ffffff" : "#a8a8a8",
                border: isActive ? "1px solid #0095f6" : "1px solid #262626",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {cat.replace("_", " ")}
            </button>
          );
        })}
      </div>

      {/* Cards Display Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#a8a8a8" }}>
          Searching for available photographers...
        </div>
      ) : photographers.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "20px" 
        }}>
          {photographers.map((photographer) => (
  <div
    key={photographer._id}
    onClick={() => onSelectPhotographer && onSelectPhotographer(photographer._id)}
    style={{
      background: "#121212",
      border: "1px solid #262626",
      borderRadius: "12px",
      padding: "20px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justify: "space-between",
      transition: "border 0.2s ease"
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0095f6"}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = "#262626"}
  >
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ 
          width: "42px", 
          height: "42px", 
          borderRadius: "50%", 
          background: "#262626", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontWeight: "bold",
          color: "#0095f6"
        }}>
          {(photographer.user?.name || "P").charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#fff" }}>
            {photographer.user?.name || "Photographer"}
          </h3>
          <span style={{ fontSize: "12px", color: "#0095f6", fontWeight: "500" }}>
            {photographer.specialization || "General"}
          </span>
        </div>
      </div>

      <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#a8a8a8" }}>
        📍 {photographer.location || "Location not specified"}
      </p>
    </div>

    <div style={{ 
      borderTop: "1px solid #262626", 
      paddingTop: "12px", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center" 
    }}>
      <span style={{ fontSize: "12px", color: "#a8a8a8" }}>Starting from</span>
      <span style={{ fontSize: "16px", fontWeight: "700", color: "#22c55e" }}>
        ₹{photographer.pricePerEvent ?? "N/A"}
      </span>
    </div>
  </div>
))}

          
        </div>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "48px 16px", 
          background: "#121212", 
          borderRadius: "12px", 
          border: "1px solid #262626" 
        }}>
          <p style={{ margin: 0, fontSize: "15px", color: "#a8a8a8" }}>
            No photographers matched your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  background: "#000000",
  border: "1px solid #262626",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
};

export default Explore;