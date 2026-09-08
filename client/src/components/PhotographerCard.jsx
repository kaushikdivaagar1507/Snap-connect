import React from "react";

const PhotographerCard = ({ photographer, onSelect }) => {
    return (
        <div 
            className="photographer-card" 
            onClick={() => onSelect && onSelect(photographer)}
            style={{
                border: "1px solid #dbdbdb",
                borderRadius: "8px",
                padding: "16px",
                margin: "10px",
                cursor: "pointer",
                backgroundColor: "#fff"
            }}
        >
            <h3>{photographer?.name || "Photographer"}</h3>
            <p><strong>Specialization:</strong> {photographer?.specialization || "General"}</p>
            <p><strong>Location:</strong> {photographer?.location || "N/A"}</p>
            <p><strong>Starting Price:</strong> ₹{photographer?.price || "N/A"}</p>
        </div>
    );
};

export default PhotographerCard;