// src/components/GimnasioCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const GimnasioCard = ({ gimnasio }) => {
  return (
    <div className="gimnasio-card">
      <Link to={`/gimnasios/${gimnasio.id}`} className="gimnasio-link">
        <h2>{gimnasio.nombre}</h2>
        <p>{gimnasio.direccion}</p>
      </Link>
    </div>
  );
};

export default GimnasioCard;