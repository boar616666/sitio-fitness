import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setMessage('Email de verificación reenviado. Revisa tu bandeja de entrada.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al reenviar el email');
      setMessage('');
    }
  };

  return (
    <div className="verification-form-container">
      <form className="verification-form" onSubmit={handleSubmit}>
        <h2 className="verification-title">Reenviar Email de Verificación</h2>
        {error && <p className="verification-error">{error}</p>}
        {message && <p className="verification-success">{message}</p>}
        
        <input
          type="email"
          className="verification-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email registrado"
          required
        />
        
        <button type="submit" className="verification-button primary">
          Reenviar Email
        </button>
        <button 
          type="button" 
          className="verification-button secondary"
          onClick={() => navigate('/login')}
        >
          Volver a Login
        </button>
      </form>
    </div>
  );
};

export default ResendVerification;