import React from "react";
import { Link } from "react-router-dom";

const GimnasioCard = ({ gimnasio, isAdmin, onDelete }) => {
  // URL de imagen predeterminada en caso de que no exista
  const imagenPredeterminada = "https://img.freepik.com/foto-gratis/gimnasio-luz-gimnasio-equipos-moderno_124507-14735.jpg";

  return (
    <div className="gimnasio-card">
      <img 
        src={gimnasio.imagen || imagenPredeterminada} 
        alt={gimnasio.nombre} 
        className="gimnasio-image" 
        onError={(e) => {
          e.target.src = imagenPredeterminada;
        }}
      />
      
      <div className="gimnasio-info">
        <h2>{gimnasio.nombre}</h2>
        <p>{gimnasio.direccion}</p>
        <p className="gimnasio-horario">
          <span className="horario-label">Horario:</span> {gimnasio.hora_entrada} - {gimnasio.hora_salida}
        </p>
        <p>{gimnasio.descripcion}</p>
        
        <Link 
          to={`/gimnasios/${gimnasio.id_gimnasio}`} 
          className="ver-detalles-btn"
        >
          Ver detalles
        </Link>

        {isAdmin && (
          <button 
            className="delete-gym-btn"
            onClick={() => onDelete(gimnasio.id_gimnasio)}
          >
            Eliminar Gimnasio
          </button>
        )}
      </div>
    </div>
  );
};

export default GimnasioCard;