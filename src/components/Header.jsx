import { Link } from "react-router-dom";
import "../styles/global.css";

function Header() {
  return (
    <header className="header">
      <nav>
        <h1>FitnessPro</h1>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/citas">Agendar Citas</Link></li>
          <li><Link to="/videos">Videos</Link></li>
        </ul>
      </nav>
      <Link to="/login" className="login-button">Iniciar Sesión</Link>
    </header>
  );
}

export default Header;
