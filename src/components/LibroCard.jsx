// src/components/LibroCard.jsx
import React from "react";
import "../styles/global.css";

const LibroCard = ({ libro, onPdfClick }) => {
  return (
    <div className="libro-card">
      <div className="libro-icon">
        <span role="img" aria-label="libro">📚</span>
      </div>
      <h2>{libro.titulo}</h2>
      <p>{libro.descripcion}</p>
      <button 
        className="btn-ver-pdf" 
        onClick={() => onPdfClick(libro.archivo)}
      >
        Ver PDF
      </button>
    </div>
  );
};

export default LibroCard;
