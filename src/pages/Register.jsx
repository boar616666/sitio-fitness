import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    message: "",
    valid: false,
    messages: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (registerType === "entrenador") {
      fetchGimnasios();
    }
  }, [registerType]);

  const fetchGimnasios = async () => {
    try {
      const response = await api.get("/api/gimnasios/listar");
      if (response.data.exito) {
        setGimnasios(response.data.datos);
      } else {
        setError(response.data.mensaje || "Error al cargar gimnasios");
      }
    } catch (error) {
      setError("No se pudieron cargar los gimnasios. Intente más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "contrasena") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    let strength = 0;
    let messages = [];
    
    if (password.length >= 8) strength++;
    else messages.push("8 caracteres mínimo");
    if (/[A-Z]/.test(password)) strength++;
    else messages.push("una mayúscula");
    if (/[a-z]/.test(password)) strength++;
    else messages.push("una minúscula");
    if (/\d/.test(password)) strength++;
    else messages.push("un número");
    if (/[!@#$%^&*(),.?\":{}|<>]/.test(password)) strength++;
    else messages.push("un carácter especial");
    
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
      valid: strength >= 4,
      messages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (registerType === "entrenador" && !formData.id_gimnasio) {
      setError("Por favor selecciona un gimnasio");
      setIsSubmitting(false);
      return;
    }

    if (!passwordStrength.valid) {
      setError("La contraseña no cumple con los requisitos mínimos de seguridad");
      setIsSubmitting(false);
      return;
    }

    try {
      let endpoint, dataToSend;

      if (registerType === "usuario") {
        endpoint = "/api/usuarios/registrar";
        dataToSend = {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rol: formData.rol,
        };
      } else {
        endpoint = "/api/entrenadores/crear";
        dataToSend = {
          id_gimnasio: parseInt(formData.id_gimnasio),
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          foto: formData.foto || "https://via.placeholder.com/150",
          edad: parseInt(formData.edad),
          costo_sesion: parseFloat(formData.costo_sesion),
          costo_mensual: parseFloat(formData.costo_mensual),
          telefono: formData.telefono,
        };
      }

      const response = await api.post(endpoint, dataToSend);

      if (response.data.exito) {
        alert(`¡Registro exitoso como ${registerType}! Por favor inicia sesión.`);
        navigate("/login");
      } else {
        setError(response.data.mensaje || "Error en el registro");
      }
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
        "Error en la operación. Verifica tus datos."
      );
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="login-container register-container">
      <h2>Registro de {registerType === "entrenador" ? "Entrenador" : "Usuario"}</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="register-type-toggle">
        <button
          type="button"
          className={`toggle-btn ${registerType === "usuario" ? "active" : ""}`}
          onClick={() => setRegisterType("usuario")}
        >
          Registrarse como Usuario
        </button>
        <button
          type="button"
          className={`toggle-btn ${registerType === "entrenador" ? "active" : ""}`}
          onClick={() => setRegisterType("entrenador")}
        >
          Registrarse como Entrenador
        </button>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Nombre completo:</label>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico:</label>
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
            placeholder="Crea una contraseña segura"
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength="8"
          />
          {formData.contrasena && (
            <div className={`password-strength strength-${passwordStrength.level}`}>
              Fortaleza: {passwordStrength.message}
            </div>
          )}
          {renderPasswordRequirements()}
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
              <label>URL de foto de perfil:</label>
              <input
                type="url"
                name="foto"
                placeholder="https://ejemplo.com/foto.jpg"
                value={formData.foto}
                onChange={handleChange}
                pattern="https?://.+"
              />
              <small className="hint">Opcional. Si no proporcionas una, se usará una imagen por defecto</small>
            </div>

            <div className="form-row">
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
                  max="99"
                />
              </div>

              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="1234567890"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            <div className="form-row">
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
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="button primary-button"
          disabled={isSubmitting || (registerType === "entrenador" && !formData.id_gimnasio)}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Registrando...
            </>
          ) : `Registrarse como ${registerType === "entrenador" ? "Entrenador" : "Usuario"}`}
        </button>
      </form>

      <div className="login-link">
        <p>¿Ya tienes cuenta?</p>
        <Link to="/login" className="toggle-link">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}

export default Register;