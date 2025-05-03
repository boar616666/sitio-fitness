import React from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import "../styles/global.css";

function Footer() {
  return (
    <footer className="gimnasio-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h5>Enlaces Rápidos</h5>
          <ul>
            <li>
              <Link to="/">Inicio</Link> {/* Enlace a la página de inicio */}
            </li>
            <li>
              <Link to="/blog">Blog</Link> {/* Enlace a la página de blog */}
            </li>
            <li>
              <Link to="/citas">Agendar Citas</Link> {/* Enlace a la página de citas */}
            </li>
            <li>
              <Link to="/videos">Videos</Link> {/* Enlace a la página de videos */}
            </li>
            <li>
              <Link to="/gimnasios">Gimnasios</Link> {/* Enlace a la página de gimnasios */}
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Redes Sociales</h5>
          <ul className="social-links">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i> Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 FitnessPro. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;