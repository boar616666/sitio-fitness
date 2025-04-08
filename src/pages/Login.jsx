// Verifica que todos los imports existan
import { useState, useRef } from "react";
import axios from "axios"; // Asegúrate de que está instalado (npm install axios)
import { useNavigate } from "react-router-dom"; // Verifica que react-router-dom esté instalado
import ReCAPTCHA from "react-google-recaptcha"; // Debe estar instalado
import "../styles/global.css"; // Verifica que la ruta sea correcta

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaVerified(!!token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verifica CAPTCHA solo en registro
    if (isRegister && !captchaVerified) {
      setError("Por favor verifica el CAPTCHA");
      return;
    }

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister 
        ? { ...formData, captchaToken: captchaRef.current.getValue() }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload
      );

      if (isRegister) {
        alert("¡Registro exitoso! Verifica tu email.");
        captchaRef.current.reset(); // Reinicia el CAPTCHA
        setIsRegister(false);
      } else {
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        (isRegister ? "Error en registro" : "Credenciales incorrectas")
      );
      if (captchaRef.current) captchaRef.current.reset();
    }
  };
  return (
    <div className="login-container">
      <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>

        {isRegister && (
          <div className="captcha-container">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey="6LdFFQgrAAAAAA-FMYiSLoVzBL1iNKR79XPU7mFy"
              onChange={handleCaptchaChange}
            />
          </div>
        )}

        <button type="submit">{isRegister ? "Registrarse" : "Ingresar"}</button>
      </form>

      <p>
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <span
          className="toggle-link"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            if (captchaRef.current) captchaRef.current.reset();
          }}
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </span>
      </p>
    </div>
  );
}

export default Login;