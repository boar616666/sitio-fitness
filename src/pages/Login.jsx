import { useState } from "react";
import "../styles/global.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="login-container">
      <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>
      <form>
        {isRegister && (
          <div>
            <label>Nombre:</label>
            <input type="text" placeholder="Tu nombre" required />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Correo electrónico" required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" placeholder="Contraseña" required />
        </div>
        <button type="submit">{isRegister ? "Registrarse" : "Ingresar"}</button>
      </form>
      <p>
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <span className="toggle-link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </span>
      </p>
    </div>
  );
}

export default Login;
