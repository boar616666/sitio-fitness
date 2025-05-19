import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/login.css";

// Configuración de Axios para todas las peticiones
const api = axios.create({
baseURL: "https://backend-gimnasio-lu0e.onrender.com",
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
  };

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
      // 1. Validar el CAPTCHA con la ruta correcta
      const captchaResponse = await api.post("api/auth/validar-captcha", {
        captchaToken: captchaValue
      });

      if (!captchaResponse.data.success) {
        setError("CAPTCHA inválido. Inténtalo de nuevo.");
        setIsSubmitting(false);
        return;
      }

      // 2. Preparar datos para el registro
      let endpoint, dataToSend;

      if (registerType === "usuario") {
        endpoint = "/usuarios/registrar";
        dataToSend = {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rol: formData.rol,
        };
      } else {
        endpoint = "/entrenadores/crear";
        dataToSend = {
          id_gimnasio: parseInt(formData.id_gimnasio),
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          foto: formData.foto,
          edad: parseInt(formData.edad),
          costo_sesion: parseFloat(formData.costo_sesion),
          costo_mensual: parseFloat(formData.costo_mensual),
          telefono: formData.telefono,
        };
      }

      // 3. Registrar el usuario/entrenador
      const response = await api.post(endpoint, dataToSend);

      if (response.data.exito) {
        alert(`¡Registro exitoso como ${registerType}! Por favor inicia sesión.`);
        resetForm();
        navigate("/login");
      } else {
        setError(response.data.mensaje || "Error en el registro");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error en la operación. Verifica tus datos."
      );
    } finally {
      setIsSubmitting(false);
    }
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
            placeholder="Tu contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength="6"
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