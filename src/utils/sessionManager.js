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
  const response = window.confirm('Tu sesión está por expirar. ¿Deseas mantenerla activa?');
  
  if (response) {
    resetSessionTimer();
  } else {
    cerrarSesion();
  }

  // Si no hay respuesta después de 30 segundos, cerrar sesión
  setTimeout(() => {
    if (sessionTimer) {
      cerrarSesion();
    }
  }, 30000);
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
  window.location.href = '/login';
};