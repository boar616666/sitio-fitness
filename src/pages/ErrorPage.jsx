import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const ErrorPage = () => {
   const navigate = useNavigate();

  const handleGoBack = () => {
  if (window.history.state && window.history.length > 1) {
    navigate(-1); // vuelve sin recargar
  } else {
    navigate("/"); // redirige a inicio si no hay historial
  }
  };

  return (
    <div className="fullscreen-error">
      <div className="error-content">
        <h1>Error 404 </h1>
        
        <div className="error-message">
          <p>Buscaste tanto que te rompiste el manguito auch🤕😖</p>
          <div className="error-image">
            <img 
              src="https://i0.wp.com/ortopediapuebla.com/wp-content/uploads/2016/10/manguito-rotador.jpg?fit=600%2C518&ssl=1" 
              alt="Imagen de manguito rotador" 
            />
          </div>
        </div>
        
        <p className="help-text">Tal vez esto te ayude:</p>
        
        <button onClick={handleGoBack} className="home-button">
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;