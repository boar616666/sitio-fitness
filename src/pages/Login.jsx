import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [token, setToken] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Proceso de login
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { correo: formData.correo, contrasena: formData.contrasena },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del login: ", response);
      const dataEntrenador = response.data.datos;
      console.log("Datos del entrenador antes de almacenar:", dataEntrenador);
      sessionStorage.setItem("correo", dataEntrenador.correo);
      sessionStorage.setItem("nombre", dataEntrenador.nombre);
      sessionStorage.setItem("tipoUsuario", dataEntrenador.tipo);

      if (dataEntrenador.tipo === "entrenador") {
        sessionStorage.setItem(
          "costoSesionEntrenador",
          datos.costo_sesion || ""
        );
        sessionStorage.setItem(
          "costoMensualEntrenador",
          datos.costo_mensual || ""
        );
        sessionStorage.setItem("telefono", datos.telefono || "");
      } else {
        sessionStorage.setItem("correo", datos.correo);
        sessionStorage.setItem("nombre", datos.nombre);
        sessionStorage.setItem("tipoUsuario", "cliente");
        sessionStorage.setItem("idUsuario", datos.id_usuario);
        sessionStorage.setItem("rolCliente", datos.rol);
      }
      window.location.href="/";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al verificar el token. Intenta de nuevo."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
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
          />
        </div>

        <button type="submit" className="button">
          Ingresar
        </button>
      </form>

      {!showTokenForm && (
        <>
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
      )}
    </div>
  );
}

export default Login;