import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/login.css";

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

function Register() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get("type");
  
  const [registerType, setRegisterType] = useState(typeFromUrl === "entrenador" ? "entrenador" : "usuario");
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    nombre: "",
    rol: "cliente",
    id_gimnasio: "",
    foto: "",
    edad: "",
    costo_sesion: "",
    costo_mensual: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [gimnasios, setGimnasios] = useState([]);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    message: "",
    valid: false,
    messages: []
  });
  const RECAPTCHA_SITE_KEY = "6LdFFQgrAAAAAA-FMYiSLoVzBL1iNKR79XPU7mFy";
  const navigate = useNavigate();

  useEffect(() => {
    if (registerType === "entrenador") {
      fetchGimnasios();
    }
  }, [registerType]);

  const fetchGimnasios = async () => {
    try {
      const response = await api.get("/gimnasios/listar");
      if (response.data.exito) {
        setGimnasios(response.data.datos);
      }
    } catch (error) {
      console.error("Error al cargar gimnasios:", error);
      setError("No se pudieron cargar los gimnasios. Intente más tarde.");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar contraseña en tiempo real
    if (name === "contrasena") {
      validatePassword(value);
    }
  };

  const resetForm = () => {
    setFormData({
      correo: "",
      contrasena: "",
      nombre: "",
      rol: "cliente",
      id_gimnasio: "",
      foto: "",
      edad: "",
      costo_sesion: "",
      costo_mensual: "",
      telefono: "",
    });
    setCaptchaValue(null);
    setPasswordStrength({
      level: 0,
      message: "",
      valid: false,
      messages: []
    });
  };

  const isFormValid = () => {
    const basicFields = formData.nombre && formData.correo && formData.contrasena && captchaValue;
    
    if (registerType === "entrenador") {
      return basicFields && 
             formData.id_gimnasio && 
             formData.foto && 
             formData.edad && 
             formData.costo_sesion && 
             formData.costo_mensual && 
             formData.telefono &&
             passwordStrength.valid;
    }
    
    return basicFields && passwordStrength.valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validar campos base
      if (!formData.nombre || !formData.correo || !formData.contrasena) {
        throw new Error("Todos los campos son obligatorios");
      }

      if (registerType === "entrenador") {
        // Validar campos específicos de entrenador
        const idGimnasio = Number(formData.id_gimnasio);
        const edad = Number(formData.edad);
        const costoSesion = Number(formData.costo_sesion);
        const costoMensual = Number(formData.costo_mensual);

        if (isNaN(idGimnasio) || idGimnasio <= 0) {
          throw new Error("ID de gimnasio inválido");
        }
        if (isNaN(edad) || edad < 18) {
          throw new Error("Edad inválida");
        }
        if (isNaN(costoSesion) || costoSesion < 0) {
          throw new Error("Costo por sesión inválido");
        }
        if (isNaN(costoMensual) || costoMensual < 0) {
          throw new Error("Costo mensual inválido");
        }
        if (!formData.foto || !formData.telefono) {
          throw new Error("La foto y el teléfono son obligatorios");
        }

        // Crear objeto de entrenador
        const datosEntrenador = {
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim().toLowerCase(),
          contrasena: formData.contrasena,
          id_gimnasio: idGimnasio,
          foto: formData.foto.trim(),
          edad: edad,
          costo_sesion: costoSesion,
          costo_mensual: costoMensual,
          telefono: formData.telefono.trim()
        };

        // Imprimir datos para debug
        console.log('URL de la API:', api.defaults.baseURL);
        console.log('Endpoint:', '/entrenadores/crear');
        console.log('Datos a enviar:', JSON.stringify(datosEntrenador, null, 2));

        // Intentar crear el entrenador
        const response = await api.post('/entrenadores/crear', datosEntrenador);
        
        if (!response.data.exito) {
          throw new Error(response.data.mensaje || "Error en el registro");
        }

        alert('¡Registro exitoso como entrenador! Por favor inicia sesión.');
        resetForm();
        navigate("/login");
      } else {
        // Para usuarios normales
        const registroData = {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          'g-recaptcha-response': captchaValue,
          rol: 'cliente'
        };
        const response = await api.post('/usuarios/registrar', registroData);
        
        if (response.data.exito) {
          alert('¡Registro exitoso! Por favor inicia sesión.');
          resetForm();
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error detallado:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        data: err.response?.data
      });
      
      setError(
        err.response?.data?.mensaje || 
        err.response?.data?.detalles || 
        err.message || 
        "Error en el registro. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estilos para la barra de fortaleza de contraseña
  const getStrengthColor = () => {
    switch(passwordStrength.level) {
      case 1: return "#ff4d4d"; // Rojo (débil)
      case 2: return "#ffcc00"; // Amarillo (media)
      case 3: return "#4CAF50"; // Verde (fuerte)
      default: return "#e0e0e0"; // Gris (sin datos)
    }
  };

  const getStrengthWidth = () => {
    return `${(passwordStrength.level / 3) * 100}%`;
  };

  return (
    <div className="login-container">
      <h2>Registro</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-options">
          <label>Tipo de registro:</label>
          <div className="register-type-selector">
            <button
              type="button"
              className={`register-type-btn ${
                registerType === "usuario" ? "active" : ""
              }`}
              onClick={() => setRegisterType("usuario")}
            >
              Usuario
            </button>
            <button
              type="button"
              className={`register-type-btn ${
                registerType === "entrenador" ? "active" : ""
              }`}
              onClick={() => setRegisterType("entrenador")}
            >
              Entrenador
            </button>
          </div>
        </div>

        {registerType === "entrenador" && (
          <>
            <div className="form-group">
              <label>Gimnasio:</label>
              <select 
                name="id_gimnasio" 
                value={formData.id_gimnasio}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un gimnasio</option>
                {gimnasios.map((gym) => (
                  <option key={gym.id_gimnasio} value={gym.id_gimnasio}>
                    {gym.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>URL de foto:</label>
              <input
                type="text"
                name="foto"
                placeholder="https://ejemplo.com/foto.jpg"
                value={formData.foto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Edad:</label>
              <input
                type="number"
                name="edad"
                placeholder="30"
                value={formData.edad}
                onChange={handleChange}
                required
                min="18"
              />
            </div>

            <div className="form-group">
              <label>Costo por sesión ($):</label>
              <input
                type="number"
                name="costo_sesion"
                placeholder="25.00"
                value={formData.costo_sesion}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Costo mensual ($):</label>
              <input
                type="number"
                name="costo_mensual"
                placeholder="200.00"
                value={formData.costo_mensual}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                name="telefono"
                placeholder="123-456-7890"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            placeholder="correo@ejemplo.com"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            placeholder="Tu contraseña segura"
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength="8"
          />
          
          {/* Visualización de fortaleza de contraseña */}
          {formData.contrasena && (
            <div className="password-strength-container">
              <div className="password-strength-bar">
                <div 
                  className="password-strength-indicator"
                  style={{
                    width: getStrengthWidth(),
                    backgroundColor: getStrengthColor()
                  }}
                ></div>
              </div>
              <div className="password-strength-info">
                <span>Fortaleza: {passwordStrength.message}</span>
                {!passwordStrength.valid && (
                  <div className="password-requirements">
                    <small>La contraseña necesita:</small>
                    <ul>
                      {passwordStrength.messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
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
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className="toggle-text">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="toggle-link">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

export default Register;