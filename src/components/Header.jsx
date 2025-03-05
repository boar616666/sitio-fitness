import { Link } from "react-router-dom";
import "../styles/global.css";
import Navbar from "./Navbar"; // Importa el componente Navbar

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>FitnessPro</h1>
        <div className="header-right">
          <Link to="/login" className="login-button">Iniciar Sesión</Link>
          <Navbar />
        </div>
      </div>
    </header>
  );
}

export default Header;