import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token || token.length < 10) {
          throw new Error('Token inválido');
        }

        // Ajusta la ruta para producción
        const response = await api.get(`/api/auth/verify-email/${token}`);
        
        if (response.data.exito) {
          setStatus('success');
          setTimeout(() => navigate('/login?verified=true'), 3000);
        } else {
          throw new Error(response.data.mensaje || 'Error al verificar');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        setErrorMessage(
          error.response?.data?.mensaje || 
          error.message || 
          'Error al verificar el email. Por favor intenta nuevamente.'
        );
        setTimeout(() => navigate('/register'), 5000);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        {status === 'verifying' && (
          <>
            <h2 className="verification-title">Verificando tu email...</h2>
            <p className="verification-text">Por favor espera mientras confirmamos tu dirección de correo.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <h2 className="verification-success">¡Email verificado con éxito!</h2>
            <p className="verification-text">Redirigiendo al inicio de sesión...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h2 className="verification-error">Error de verificación</h2>
            <p className="verification-text">{errorMessage}</p>
            <p className="verification-text">Serás redirigido al registro...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
