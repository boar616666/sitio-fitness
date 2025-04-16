import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "", // Cambiado de 'name' a 'username'
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaVerified(!!token);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (isRegister && !formData.username.trim()) {
      errors.username = "El nombre de usuario es requerido";
      isValid = false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errors.email = "Por favor ingresa un email válido";
      isValid = false;
    }
    if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
      isValid = false;
    }
    if (isRegister && !captchaVerified) {
      setError("Por favor verifica el CAPTCHA");
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) return;

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister 
        ? { 
            username: formData.username, // Usamos el campo username directamente
            email: formData.email, 
            password: formData.password,
            captchaToken: captchaRef.current?.getValue() 
          }
        : { email: formData.email, password: formData.password };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      };

      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload,
        config
      );

      if (isRegister) {
        alert("¡Registro exitoso! Por favor inicia sesión.");
        setFormData({ username: "", email: "", password: "" });
        if (captchaRef.current) captchaRef.current.reset();
        setIsRegister(false);
      } else {
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Error completo:", err);
      
      if (err.message === "Network Error") {
        setError("Error de conexión con el servidor");
        return;
      }

      // Manejo mejorado de errores
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          serverErrors[error.path] = error.msg;
        });
        setFieldErrors(serverErrors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error. Por favor intenta nuevamente.");
      }
      
      if (captchaRef.current) captchaRef.current.reset();
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label>Nombre de usuario:</label>
            <input
              type="text"
              name="username"  // Cambiado de 'name' a 'username'
              placeholder="Tu nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className={fieldErrors.username ? "error" : ""}
              required
            />
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>
        )}

        {/* Resto del formulario permanece igual */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            className={fieldErrors.email ? "error" : ""}
            required
          />
          {fieldErrors.email && (
            <span className="field-error">{fieldErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            className={fieldErrors.password ? "error" : ""}
            required
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
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

        <button type="submit" className="button">
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>
      </form>

      <p className="toggle-text">
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <span
          className="toggle-link"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setFieldErrors({});
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