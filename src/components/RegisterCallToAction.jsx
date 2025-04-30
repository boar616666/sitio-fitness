import { Link } from "react-router-dom";
import "../styles/login.css";

/**
 * Componente de llamada a la acción para registro
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la llamada a la acción
 * @param {string} props.description - Descripción de la llamada a la acción
 * @param {string} props.buttonText - Texto del botón (por defecto "Regístrate ahora")
 * @param {string} props.type - Tipo de registro a preseleccionar "usuario" o "entrenador" (por defecto "usuario")
 */
function RegisterCallToAction({ title, description, buttonText = "Regístrate ahora", type = "usuario" }) {
  // Construir la URL con el tipo de registro preseleccionado
  const registerUrl = `/register?type=${type}`;

  return (
    <div className="register-cta-container">
      <h3 className="register-cta-title">{title}</h3>
      <p className="register-cta-description">{description}</p>
      <Link to={registerUrl} className="register-cta-button">
        {buttonText}
      </Link>
    </div>
  );
}

export default RegisterCallToAction; 