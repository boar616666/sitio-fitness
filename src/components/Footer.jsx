import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

function Footer() {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");
  const [showSiteMap, setShowSiteMap] = useState(false);

  return (
    <footer className="gimnasio-footer">
      {showSiteMap && (
        <div className="sitemap-modal">
          <div className="sitemap-content">
            <h3>Mapa del Sitio</h3>
            <div className="sitemap-grid">
              <div className="sitemap-section">
                <h4>Páginas Principales</h4>
                <ul>
                  <li>
                    <Link to="/" onClick={() => setShowSiteMap(false)}>
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" onClick={() => setShowSiteMap(false)}>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/gimnasios" onClick={() => setShowSiteMap(false)}>
                      Gimnasios
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacidad" onClick={() => setShowSiteMap(false)}>
                      Política de Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link to="/terminos" onClick={() => setShowSiteMap(false)}>
                      Términos y Condiciones
                    </Link>
                  </li>
                </ul>
              </div>
              {tipoUsuario === "cliente" && (
                <div className="sitemap-section">
                  <h4>Área de Clientes</h4>
                  <ul>
                    <li>
                      <Link to="/videos" onClick={() => setShowSiteMap(false)}>
                        Videos
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <button
              className="close-modal"
              onClick={() => setShowSiteMap(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="footer-content">
        <div className="footer-section">
          <h5>Enlaces Rápidos</h5>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            {tipoUsuario === "cliente" && (
              <li>
                <Link to="/videos">Videos</Link>
              </li>
            )}
            <li>
              <Link to="/gimnasios">Gimnasios</Link>
            </li>
            <li>
              <Link to="/privacidad">Política de Privacidad</Link>
            </li>
            <li>
              <button
                className="sitemap-button"
                onClick={() => setShowSiteMap(true)}
              >
                Mapa del Sitio
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Redes Sociales</h5>
          <ul className="social-links">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2025 FitnessPro. Todos los derechos reservados. |{" "}
          <Link to="/privacidad" className="legal-link">
            Política de Privacidad
          </Link>{" "}
          |{" "}
          <Link to="/terminos" className="legal-link">
            Términos y Condiciones
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;