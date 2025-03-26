import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";
import logo from '../assets/logo.png'; // Asegúrate de que la ruta sea correcta

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      {/* Logo clickeable */}
      <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
        <img src={logo} alt="FitnessPro Logo" className="navbar-logo" />
      </Link>

      {/* Menú de navegación */}
      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>Inicio</Link>
        <Link to="/blog" onClick={handleLinkClick}>Blog</Link>
        <Link to="/citas" onClick={handleLinkClick}>Instructores</Link>
        <Link to="/videos" onClick={handleLinkClick}>Videos</Link>
        <Link to="/gimnasios" onClick={handleLinkClick}>Gimnasios</Link>
      </div>

      {/* Botón hamburguesa (solo en móvil) */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
      </div>
    </nav>
  );
};

export default Navbar;