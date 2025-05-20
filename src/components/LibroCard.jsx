// src/components/LibroCard.jsx
import React from "react";
import "../styles/global.css";

const LibroCard = ({ libro }) => {
  return (
    <div className="libro-card">
      <div className="libro-icon">
        {/* Puedes usar un ícono o una imagen aquí */}
        <span role="img" aria-label="libro">📚</span>
      </div>
      <h2>{libro.titulo}</h2>
      <p>{libro.descripcion}</p>
      <a href={libro.archivo} target="_blank" rel="noopener noreferrer" className="libro-link">
        Descargar PDF
      </a>
    </div>
  );
};

export default LibroCard;
