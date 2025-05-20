import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/login.css";

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

function Login() {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [token, setToken] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [error, setError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Configuración de reCAPTCHA (usa tu clave real)
  const RECAPTCHA_SITE_KEY = "6LdFFQgrAAAAAA-FMYiSLoVzBL1iNKR79XPU7mFy";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!captchaVerified) {
      setError("Por favor completa el CAPTCHA");
      return;
    }

    setLoadingLogin(true);
    try {
      const response = await api.post(
        "/auth/login",
        { correo: formData.correo, contrasena: formData.contrasena }
      );
      
      const datos = response.data.datos;
      if (datos.requiere_2fa) {
        setPendingData(datos);
        setShowTokenForm(true);
      } else {
        setError("Este usuario no requiere 2FA, revisa el flujo.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error en la operación. Verifica tus datos."
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingToken(true);
    try {
      let payload = { token };
      if (pendingData.id_entrenador) {
        payload.id_entrenador = pendingData.id_entrenador;
        payload.tipo = "entrenador";
      } else if (pendingData.id_usuario) {
        payload.id_usuario = pendingData.id_usuario;
        payload.tipo = "cliente";
      }
      
      const response = await api.post(
        "/auth/verificar-token",
        payload
      );
      
      const datos = response.data.datos;
      if (payload.tipo === "entrenador") {
        sessionStorage.setItem("correo", datos.correo);
        sessionStorage.setItem("nombre", datos.nombre);
        sessionStorage.setItem("tipoUsuario", "entrenador");
        sessionStorage.setItem("idEntrenador", datos.id_entrenador);
        sessionStorage.setItem("idGimEntrenador", datos.id_gimnasio);
        sessionStorage.setItem("foto", datos.foto || "");
        sessionStorage.setItem("edad", datos.edad || "");
        sessionStorage.setItem("costoSesionEntrenador", datos.costo_sesion || "");
        sessionStorage.setItem("costoMensualEntrenador", datos.costo_mensual || "");
        sessionStorage.setItem("telefono", datos.telefono || "");
      } else {
        sessionStorage.setItem("correo", datos.correo);
        sessionStorage.setItem("nombre", datos.nombre);
        sessionStorage.setItem("tipoUsuario", "cliente");
        sessionStorage.setItem("idUsuario", datos.id_usuario);
        sessionStorage.setItem("rolCliente", datos.rol);
      }
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al verificar el token. Intenta de nuevo."
      );
    } finally {
      setLoadingToken(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}

      {!showTokenForm ? (
        <>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Correo:</label>
              <input
                type="email"
                name="correo"
                placeholder="correo@ejemplo.com"
                value={formData.correo}
                onChange={handleChange}
                required
                disabled={loadingLogin}
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                placeholder="Tu contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
                disabled={loadingLogin}
              />
            </div>

            {/* Widget reCAPTCHA */}
            <div className="captcha-container">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => {
                  setCaptchaVerified(true);
                  setError("");
                }}
                onExpired={() => {
                  setCaptchaVerified(false);
                  setError("El CAPTCHA ha expirado, verifica de nuevo");
                }}
                onErrored={() => {
                  setCaptchaVerified(false);
                  setError("Error al cargar CAPTCHA, recarga la página");
                }}
              />
            </div>

            <button 
              type="submit" 
              className="button" 
              disabled={loadingLogin || !captchaVerified}
            >
              {loadingLogin ? (
                <>
                  Ingresando
                  <span className="button-spinner" />
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <p className="toggle-text">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="toggle-link">
              Regístrate
            </Link>
          </p>

          <p className="toggle-text">
            ¿Perdiste tu contraseña?{" "}
            <Link to="/recuperarContraseña" className="toggle-link">
              Recuperar contraseña
            </Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleTokenSubmit}>
          <div className="form-group">
            <label>Ingresa el código de verificación</label>
            <input
              type="text"
              name="token"
              placeholder="Código de 6 dígitos"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              maxLength={6}
              disabled={loadingToken}
            />
          </div>
          <button type="submit" className="button" disabled={loadingToken}>
            {loadingToken ? (
              <>
                Verificando
                <span className="button-spinner" />
              </>
            ) : (
              "Verificar código"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;