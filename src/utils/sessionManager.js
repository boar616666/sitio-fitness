import { createRoot } from 'react-dom/client';
import CustomAlert from '../components/CustomAlert';
import React from 'react';

let sessionTimer = null;
//const SESSION_TIMEOUT = 5 * 60 * 1000;
const SESSION_TIMEOUT = 15 * 1000; // 15 segundos en milisegundos

export const initSessionManager = () => {
  resetSessionTimer();
  document.addEventListener('mousemove', resetSessionTimer);
  document.addEventListener('keypress', resetSessionTimer);
};

export const resetSessionTimer = () => {
  if (sessionTimer) clearTimeout(sessionTimer);
  
  sessionTimer = setTimeout(() => {
    showSessionPrompt();
  }, SESSION_TIMEOUT);
};

const showSessionPrompt = () => {
  // Crear un div para el contenedor de la alerta
  const alertContainer = document.createElement('div');
  document.body.appendChild(alertContainer);
  
  const root = createRoot(alertContainer);
  
  // Función para limpiar la alerta
  const cleanupAlert = () => {
    root.unmount();
    document.body.removeChild(alertContainer);
  };

  // Renderizar la alerta personalizada usando React.createElement
  root.render(
    React.createElement(CustomAlert, {
      message: "Tu sesión está por expirar. ¿Deseas mantenerla activa?",
      onConfirm: () => {
        cleanupAlert();
        resetSessionTimer();
      },
      onCancel: () => {
        cleanupAlert();
        cerrarSesion();
      }
    })
  );

  // Si no hay respuesta después de 15 segundos, cerrar sesión
  setTimeout(() => {
    if (sessionTimer) {
      cleanupAlert();
      cerrarSesion();
    }
  }, 15000);
};

export const cerrarSesion = () => {
  // Limpiar el timer
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
  
  // Limpiar event listeners
  document.removeEventListener('mousemove', resetSessionTimer);
  document.removeEventListener('keypress', resetSessionTimer);
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  
  // Redirigir al login
  window.location.href = '/';
};