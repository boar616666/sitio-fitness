import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

function RecuperarContraseña() {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState("");
  const [token, setToken] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    message: "",
    valid: false
  });
  const navigate = useNavigate();

  const handleCorreoSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    
    // Validación básica del correo
    if (!correo.includes("@") || !correo.includes(".")) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/recuperar", { correo });
      
      if (response.data.exito) {
        setMensaje("Hemos enviado un código de verificación a tu correo. Por favor revísalo.");
        setStep(2);
      } else {
        setError(response.data.mensaje || "No pudimos enviar el correo de recuperación. Intenta nuevamente.");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al conectar con el servidor. Intenta más tarde.");
      console.error("Error al enviar correo de recuperación:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    // Validaciones
    if (!token || token.length !== 8) {
      setError("El código de verificación debe tener 8 caracteres");
      return;
    }

    if (nuevaContrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!passwordStrength.valid) {
      setError("La contraseña no cumple con los requisitos mínimos de seguridad");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/cambiar-contrasena", {
        token,
        nuevaContrasena
      });

      if (response.data.exito) {
        setMensaje("¡Contraseña actualizada correctamente! Ya puedes iniciar sesión con tu nueva contraseña.");
        setStep(3);
      } else {
        setError(response.data.mensaje || "El código es inválido o ha expirado. Solicita uno nuevo.");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cambiar la contraseña. Intenta nuevamente.");
      console.error("Error al cambiar contraseña:", err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    let strength = 0;
    let messages = [];
    
    // Longitud mínima
    if (password.length >= 8) strength++;
    else messages.push("8 caracteres mínimo");
    
    // Mayúsculas
    if (/[A-Z]/.test(password)) strength++;
    else messages.push("una mayúscula");
    
    // Minúsculas
    if (/[a-z]/.test(password)) strength++;
    else messages.push("una minúscula");
    
    // Números
    if (/\d/.test(password)) strength++;
    else messages.push("un número");
    
    // Caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    else messages.push("un carácter especial");
    
    // Determinar nivel de fortaleza
    let level, message;
    if (strength >= 5) {
      level = 3;
      message = "Fuerte";
    } else if (strength >= 3) {
      level = 2;
      message = "Media";
    } else {
      level = 1;
      message = "Débil";
    }
    
    setPasswordStrength({
      level,
      message,
      valid: strength >= 4, // Requerimos al menos 4 de 5 criterios
      messages
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNuevaContrasena(value);
    validatePassword(value);
  };

  const renderPasswordRequirements = () => (
    <div className="password-requirements">
      <p>La contraseña debe contener:</p>
      <ul>
        {passwordStrength.messages?.map((msg, i) => (
          <li key={i} className="requirement-item">
            <span className={`requirement-${passwordStrength.messages.includes(msg) ? 'missing' : 'met'}`}>
              {msg}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="login-container recuperar-container">
      <h2>Recuperar Contraseña</h2>
      {error && <div className="error-message">{error}</div>}
      {mensaje && <div className="success-message">{mensaje}</div>}

      {step === 1 && (
        <form onSubmit={handleCorreoSubmit} className="recovery-form">
          <div className="form-group">
            <label>Correo electrónico registrado:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="button primary-button"
            disabled={loading || !correo}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : "Enviar código de verificación"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTokenSubmit} className="recovery-form">
          <div className="form-group">
            <label>Código de verificación:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ingresa el código de 8 dígitos"
              maxLength={8}
              required
              disabled={loading}
            />
            <small className="hint">Revisa tu correo electrónico para obtener el código</small>
          </div>

          <div className="form-group">
            <label>Nueva contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={nuevaContrasena}
                onChange={handlePasswordChange}
                placeholder="Crea una nueva contraseña"
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {nuevaContrasena && (
              <div className={`password-strength strength-${passwordStrength.level}`}>
                Fortaleza: {passwordStrength.message}
              </div>
            )}
            {renderPasswordRequirements()}
          </div>

          <div className="form-group">
            <label>Confirmar nueva contraseña:</label>
            <input
              type="password"
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              required
              disabled={loading}
            />
            {repetirContrasena && (
              <div className={`password-match ${
                nuevaContrasena === repetirContrasena ? "match" : "no-match"
              }`}>
                {nuevaContrasena === repetirContrasena 
                  ? "✓ Las contraseñas coinciden" 
                  : "✗ Las contraseñas no coinciden"}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="button primary-button"
              disabled={loading || !token || !nuevaContrasena || !repetirContrasena}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Cambiando...
                </>
              ) : "Cambiar contraseña"}
            </button>
            <button 
              type="button" 
              className="button secondary-button"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Volver
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="success-step">
          <div className="success-icon">✓</div>
          <p>¡Contraseña actualizada con éxito!</p>
          <button 
            className="button primary-button"
            onClick={() => navigate("/login")}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      )}

      <div className="login-links">
        <Link to="/login" className="back-to-login">
          ← Volver a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default RecuperarContraseña;