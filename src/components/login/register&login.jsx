import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "cliente" // Valor por defecto
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      
      // Para login solo enviamos correo y contraseña
      const payload = isRegister 
        ? formData 
        : { correo: formData.correo, contrasena: formData.contrasena };

      const response = await axios.post(endpoint, payload);
      
      // Guardar token y datos de usuario
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirigir según rol
      const redirectPath = response.data.user.rol === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath);
      
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error en la conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Nombre completo:</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de usuario:</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="entrenador">Entrenador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              placeholder="tucorreo@ejemplo.com"
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
              placeholder="Mínimo 6 caracteres"
              value={formData.contrasena}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : isRegister ? (
              "Registrarse"
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
        
        <p className="toggle-text">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <span 
            className="toggle-link" 
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;