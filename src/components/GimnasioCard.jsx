import React from "react";
import { Link } from "react-router-dom";

const GimnasioCard = ({ gimnasio }) => {
  return (
    <div className="gimnasio-card">
      <Link to={`/gimnasios/${gimnasio.id}`} className="gimnasio-link">
        <img src={gimnasio.fotos[0]} alt={gimnasio.nombre} className="gimnasio-image" />
        <div className="gimnasio-info">
          <h2>{gimnasio.nombre}</h2>
          <p>{gimnasio.direccion}</p>
          <button className="button">Ver más</button>
        </div>
      </Link>
    </div>
  );
};

export default GimnasioCard;