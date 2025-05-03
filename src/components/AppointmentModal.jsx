import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/modal.css';

Modal.setAppElement('#root'); // Necesario para accesibilidad

const AppointmentModal = ({ isOpen, onRequestClose, idUsuario, idEntrenador }) => {
  const [fechaHora, setFechaHora] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Console log al recibir props
  useEffect(() => {
    if (isOpen) {
      console.log('Props recibidas en el modal:');
      console.log('idUsuario:', idUsuario);
      console.log('idEntrenador:', idEntrenador);
    }
  }, [isOpen, idUsuario, idEntrenador]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Datos que se enviarán a la API
    const datosEnviar = {
      id_usuario: idUsuario,
      id_entrenador: idEntrenador,
      fecha_hora: fechaHora,
    };
    
    console.log('Datos a enviar al servidor:', datosEnviar);
    
    try {
      console.log('Iniciando petición POST a /citas/crear');
      const response = await axios.post('http://localhost:3000/citas/crear', datosEnviar);
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.exito) {
        setSuccess(true);
        setTimeout(() => {
          onRequestClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError('No se pudo agendar la cita: ' + (response.data.mensaje || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al conectar con el servidor: ' + (error.message || 'Error desconocido'));
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
    >
      <div className="appointment-modal-header">
        <h2>Agendar Cita</h2>
        <button className="close-button" onClick={onRequestClose}>×</button>
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
                onChange={(e) => {
                  setFechaHora(e.target.value);
                  console.log('Fecha y hora seleccionada:', e.target.value);
                }}
                required
                className="form-control"
              />
              <small className="form-help">Selecciona la fecha y hora para tu cita</small>
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
                disabled={loading || !fechaHora || !idUsuario || !idEntrenador}
              >
                {loading ? 'Procesando...' : 'Confirmar Cita'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentModal; 