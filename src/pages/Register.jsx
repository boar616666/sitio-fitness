import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/login.css";

function Register() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get("type");
  
  const [registerType, setRegisterType] = useState(typeFromUrl === "entrenador" ? "entrenador" : "usuario");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    nombre: "",
    rol: "cliente", // Para usuarios
    // Campos para entrenador
    id_gimnasio: "",
    foto: "",
    edad: "",
    costo_sesion: "",
    costo_mensual: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [gimnasios, setGimnasios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (registerType === "entrenador") {
      fetchGimnasios();
    }
  }, [registerType]);

  const fetchGimnasios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/gimnasios/listar"
      );
      if (response.data.exito) {
        setGimnasios(response.data.datos);
      }
    } catch (error) {
      console.error("Error al cargar gimnasios:", error);
      setError("No se pudieron cargar los gimnasios. Intente más tarde.");
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordStrength("débil");
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = 
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);
    
    if (strength < 2) setPasswordStrength("débil");
    else if (strength < 4) setPasswordStrength("media");
    else setPasswordStrength("fuerte");
    
    return strength >= 2;
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Proceso de registro
      let endpoint, dataToSend;

      if (registerType === "usuario") {
        // Registro de usuario
        endpoint = "http://localhost:3000/usuarios/registrar";
        dataToSend = {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rol: formData.rol,
        };
      } else {
        // Registro de entrenador
        endpoint = "http://localhost:3000/entrenadores/crear";
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

      await axios.post(endpoint, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(
        `¡Registro exitoso como ${registerType}! Por favor inicia sesión.`
      );
      resetForm();
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message ||
          "Error en la operación. Verifica tus datos."
      );
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
              />
            </div>

            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="text"
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
            minLength="8"
          />
          {formData.contrasena && (
            <div className={`password-strength ${passwordStrength}`}>
              Fortaleza de la contraseña: {passwordStrength}
            </div>
          )}
          <div className="password-requirements">
            La contraseña debe tener al menos:
            <ul>
              <li>8 caracteres</li>
              <li>Una letra mayúscula</li>
              <li>Una letra minúscula</li>
              <li>Un número</li>
              <li>Un carácter especial (!@#$%^&*)</li>
            </ul>
          </div>
        </div>

        <button type="submit" className="button">
          Registrarse
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