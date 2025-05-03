import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
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
          "costoMensualEntrenador",
          dataEntrenador.costo_mensual
        );
        sessionStorage.setItem(
          "costoSesionEntrenador",
          dataEntrenador.costo_sesion
        );
        sessionStorage.setItem("edad", dataEntrenador.edad);
        sessionStorage.setItem("foto", dataEntrenador.foto);
        sessionStorage.setItem("telefono", dataEntrenador.telefono);
        sessionStorage.setItem("idEntrenador", dataEntrenador.id_entrenador);
        sessionStorage.setItem("idGimEntrenador", dataEntrenador.id_gimnasio);
      }

      if (dataEntrenador.tipo === "cliente") {
        sessionStorage.setItem("rolCliente", dataEntrenador.rol);
        sessionStorage.setItem("idUsuario", dataEntrenador.id_usuario);
      }
      window.location.href="/";
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

      <p className="toggle-text">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="toggle-link">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default Login;
