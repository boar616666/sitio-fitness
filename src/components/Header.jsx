import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/global.css";
import Navbar from "./Navbar";
import logo from "../assets/logo.jpg"; // Asegúrate que la ruta sea correcta

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Verificar si el usuario está logueado al cargar el componente
  useEffect(() => {
    const checkLoginStatus = () => {
      const userType = sessionStorage.getItem("tipoUsuario");
      const rolCliente = sessionStorage.getItem("rolCliente");
      const userNombre = sessionStorage.getItem("nombre");

      if (userType && userNombre) {
        setIsLoggedIn(true);
        setUserData({
          nombre: userNombre,
          tipo: userType,
          rolCliente: rolCliente, // <--- agrega aquí el rolCliente
          correo: sessionStorage.getItem("correo"),
          foto:
            sessionStorage.getItem("foto") ||
            "https://img.freepik.com/foto-gratis/retrato-joven-sonriente-gafas_171337-4842.jpg",
        });
      } else {
        setIsLoggedIn(false);
        setUserData({});
      }
    };

    checkLoginStatus();

    // Agregamos un event listener para detectar cambios en el sessionStorage
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Cerrar el menú de perfil al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar sessionStorage
    sessionStorage.clear();

    // Actualizar estado
    setIsLoggedIn(false);
    setUserData({});
    setIsProfileMenuOpen(false);

    // Disparar evento de storage para que otros componentes se actualicen
    window.dispatchEvent(new Event("storage"));

    // Redireccionar al inicio
    navigate("/");
  };

  // Alternar el menú de perfil
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="brand-link">
          <img src={logo} alt="FitnessPro Logo" className="header-logo" />
          <h1 className="brand-title">FitnessPro</h1>
        </Link>

        <div className="header-right">
          {isLoggedIn ? (
            <div className="profile-menu-container" ref={profileMenuRef}>
              <div className="profile-button" onClick={toggleProfileMenu}>
                <img
                  src={userData.foto}
                  alt={userData.nombre}
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.src =
                      "https://img.freepik.com/foto-gratis/retrato-joven-sonriente-gafas_171337-4842.jpg";
                  }}
                />
                <span className="profile-name">{userData.nombre}</span>
                <span
                  className={`profile-arrow ${
                    isProfileMenuOpen ? "up" : "down"
                  }`}
                >
                  ▼
                </span>
              </div>

              {isProfileMenuOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-header">
                    <img
                      src={userData.foto}
                      alt={userData.nombre}
                      className="profile-dropdown-avatar"
                      onError={(e) => {
                        e.target.src =
                          "https://img.freepik.com/foto-gratis/retrato-joven-sonriente-gafas_171337-4842.jpg";
                      }}
                    />
                    <div className="profile-dropdown-info">
                      <p className="profile-dropdown-name">{userData.nombre}</p>
                      <p className="profile-dropdown-email">
                        {userData.correo}
                      </p>
                    </div>
                  </div>

                  <ul className="profile-dropdown-options">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Mi Perfil
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/mis-citas"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor"
                        >
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
                        </svg>
                        Mis Citas
                      </Link>
                    </li>

                    {/* Solo visible para administradores */}
                    {userData.rolCliente === "admin" && (
                      <li>
                        <Link
                          to="/solicitudes"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="currentColor"
                          >
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
                          </svg>
                          Solicitudes de entrenadores
                        </Link>
                      </li>
                    )}

                    <li className="dropdown-divider"></li>

                    <li>
                      <button onClick={handleLogout} className="logout-button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor"
                        >
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Iniciar Sesión
            </Link>
          )}
          <Navbar />
        </div>
      </div>
    </header>
  );
}

export default Header;
