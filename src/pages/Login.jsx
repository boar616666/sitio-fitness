import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/login.css";

// Configuración de Axios
const api = axios.create({
  baseURL: "http://localhost:3000",
});

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const RECAPTCHA_SITE_KEY = "6LdFFQgrAAAAAA-FMYiSLoVzBL1iNKR79XPU7mFy";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!captchaValue) {
      setError("Por favor, completa el CAPTCHA.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Validar el CAPTCHA
      const captchaResponse = await api.post("/auth/validar-captcha", {
        captchaToken: captchaValue,
      });

      if (!captchaResponse.data.success) {
        setError("CAPTCHA inválido. Intenta nuevamente.");
        setIsSubmitting(false);
        return;
      }

      // 2. Intentar iniciar sesión
      const response = await api.post("/auth/login", {
        correo,
        contrasena,
      });

      if (response.data.exito) {
        localStorage.setItem("token", response.data.token);
        alert("¡Inicio de sesión exitoso!");
        navigate("/"); // redirige a la página principal
      } else {
        setError(response.data.mensaje || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error de login:", err);
      setError("Error al iniciar sesión. Verifica tus datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            placeholder="Tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaValue(token)}
            onExpired={() => setCaptchaValue(null)}
          />
        </div>

        <button
          type="submit"
          className="button"
          disabled={!captchaValue || isSubmitting}
        >
          {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="toggle-text">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="toggle-link">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

export default Login;
