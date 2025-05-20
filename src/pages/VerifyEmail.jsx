import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/verification.css';

// Configuración de Axios con la ruta base correcta
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
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token || token.length < 10) {
          throw new Error('El token de verificación no es válido');
        }

        // Ruta corregida para la verificación
        const response = await api.get(`/api/auth/verify-email/${token}`);
        
        if (response.data.exito) {
          setStatus('success');
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/login', { 
                  state: { message: 'Email verificado con éxito. Ya puedes iniciar sesión.' } 
                });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          throw new Error(response.data.mensaje || 'Error al verificar el email');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        setErrorMessage(
          error.response?.data?.mensaje || 
          error.message || 
          'Ocurrió un error al verificar tu email. Por favor intenta nuevamente.'
        );
        
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/register');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    verifyToken();

    return () => clearInterval(timer);
  }, [token, navigate]);

  return (
    <div className="verification-container">
      <div className={`verification-card ${status}`}>
        {/* ... (el resto del componente permanece igual) ... */}
      </div>
    </div>
  );
};

export default VerifyEmail;