import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar la navbar al hacer clic fuera de ella
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

  // Cerrar la navbar al seleccionar una opción
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>
          Inicio
        </Link>
        {tipoUsuario === "cliente" && (
          <>
            <Link to="/videos" onClick={handleLinkClick}>
              Videos
            </Link>
          </>
        )}
        <Link to="/blog" onClick={handleLinkClick}>
          Blog
        </Link>
        <Link to="/gimnasios" onClick={handleLinkClick}>
          Gimnasios
        </Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};
export default Navbar;
