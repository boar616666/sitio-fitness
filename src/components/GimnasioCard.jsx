import React from "react";
import { Link } from "react-router-dom";

const GimnasioCard = ({ gimnasio }) => {
  return (
    <div className="gimnasio-card">
      <img 
        src={gimnasio.fotos[0]} 
        alt={gimnasio.nombre} 
        className="gimnasio-image" 
      />
      
      <div className="gimnasio-info">
        <h2>{gimnasio.nombre}</h2>
        <p>{gimnasio.direccion}</p>
        
        <Link 
          to={`/gimnasios/${gimnasio.id}`} 
          className="button ver-detalles-btn"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default GimnasioCard;