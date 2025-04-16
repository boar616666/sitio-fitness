import React, { useState } from "react";

const StarRating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          style={{
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 2px",
            color: star <= (hover || rating) ? "#ffc107" : "#e4e5e9",
            transition: "transform 0.2s",
            lineHeight: "1"
          }}
          onClick={() => {
            setRating(star);
            onRate(star);
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(rating)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;