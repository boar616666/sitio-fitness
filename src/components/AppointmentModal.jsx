import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/modal.css';

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

Modal.setAppElement('#root');

const AppointmentModal = ({ isOpen, onRequestClose, idUsuario, idEntrenador }) => {
  const [fechaHora, setFechaHora] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('Props recibidas:');
      console.log('idUsuario:', idUsuario);
      console.log('idEntrenador:', idEntrenador);
    }
  }, [isOpen, idUsuario, idEntrenador]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const datosEnviar = {
      id_usuario: idUsuario,
      id_entrenador: idEntrenador,
      fecha_hora: fechaHora,
    };

    console.log('Enviando a: /citas/crear');
    console.log('Datos:', datosEnviar);

    try {
      const response = await api.post('/citas/crear', datosEnviar);

      console.log('Respuesta:', response.data);

      if (response.data.exito) {
        setSuccess(true);
        setTimeout(() => {
          onRequestClose();
          setSuccess(false);
          setFechaHora('');
        }, 2000);
      } else {
        setError(response.data.mensaje || 'Error al agendar la cita');
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        setError(error.response.data?.mensaje || `Error ${error.response.status}`);
      } else if (error.request) {
        setError('No se recibió respuesta del servidor');
      } else {
        setError('Error al configurar la petición');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose}
      contentLabel="Agendar Cita"
      className="appointment-modal"
      overlayClassName="appointment-modal-overlay"
      shouldCloseOnOverlayClick={!loading}
    >
      <div className="appointment-modal-header">
        <h2>Agendar Cita</h2>
        <button 
          className="close-button" 
          onClick={onRequestClose}
          disabled={loading}
        >
          ×
        </button>
      </div>
      
      <div className="appointment-modal-content">
        {error && (
          <div className="error-message">
            <i className="error-icon">⚠️</i> {error}
          </div>
        )}
        
        {success ? (
          <div className="success-message">
            <i className="success-icon">✓</i> ¡Cita agendada exitosamente!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="fechaHora">Fecha y Hora:</label>
              <input
                id="fechaHora"
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                required
                className="form-control"
                min={new Date().toISOString().slice(0, 16)}
              />
              <small className="form-help">Selecciona fecha y hora para tu cita</small>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={onRequestClose} 
                className="cancel-button"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="confirm-button"
                disabled={loading || !fechaHora}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Procesando...
                  </>
                ) : 'Confirmar Cita'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentModal;