import { Link } from "react-router-dom";
import "../styles/global.css";
import Navbar from "./Navbar";
import logo from '../assets/logo.jpg'; // Asegúrate que la ruta sea correcta

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        {/* Contenedor del logo + texto (clickeable) */}
        <Link to="/" className="brand-link">
          <img src={logo} alt="FitnessPro Logo" className="header-logo" />
          <h1 className="brand-title">FitnessPro</h1>
        </Link>

        <div className="header-right">
          <Link to="/login" className="login-button">Iniciar Sesión</Link>
          <Navbar />
        </div>
      </div>
    </header>
  );
}

export default Header;