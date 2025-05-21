import React from 'react';
import '../styles/global.css';

const CustomAlert = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <h2>Sesión por expirar</h2>
        <p>{message}</p>
        <div className="custom-alert-buttons">
          <button 
            className="custom-alert-button confirm-button" 
            onClick={onConfirm}
          >
            Mantener sesión
          </button>
          <button 
            className="custom-alert-button cancel-button" 
            onClick={onCancel}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;