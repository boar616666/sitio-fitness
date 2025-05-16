import React from "react";
import "../styles/global.css";

const ErrorPage = () => {
  const handleGoHome = () => {
    window.top.location.href = '/'; // Esto afectará a la ventana principal
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
        
        <button onClick={handleGoHome} className="home-button">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;