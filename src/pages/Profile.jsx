import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/profile.css";

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

const Profile = () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [solicitudes, setSolicitudes] = useState([]);
  const [gimnasioInfo, setGimnasioInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const nombre = sessionStorage.getItem("nombre");
        const correo = sessionStorage.getItem("correo");
        const foto = sessionStorage.getItem("foto");
        const idGimnasio = sessionStorage.getItem("idGimEntrenador");

        if (tipoUsuario === "entrenador") {
          const costoMensual = sessionStorage.getItem("costoMensualEntrenador");
          const costoSesion = sessionStorage.getItem("costoSesionEntrenador");
          const edad = sessionStorage.getItem("edad");
          const telefono = sessionStorage.getItem("telefono");

          setUser({
            name: nombre,
            email: correo,
            photo: foto,
            costoMensual,
            costoSesion,
            edad,
            telefono,
          });

          // Obtener información del gimnasio si es entrenador
          if (idGimnasio) {
            const response = await api.get(`/gimnasios/${idGimnasio}`);
            if (response.data.exito) {
              setGimnasioInfo(response.data.datos);
            }
          }
        } else if (tipoUsuario === "cliente") {
          const rolCliente = sessionStorage.getItem("rolCliente");
          setUser({
            name: nombre,
            email: correo,
            photo: foto,
            rolCliente,
          });
        }

        // Obtener solicitudes si es entrenador
        const idEntrenador = sessionStorage.getItem("idEntrenador");
        if (idEntrenador) {
          const solicitudesResponse = await api.get(`/solicitudes/entrenador/${idEntrenador}/pendientes`);
          if (solicitudesResponse.data.exito) {
            setSolicitudes(solicitudesResponse.data.datos);
          }
        }
      } catch (err) {
        setError(err.response?.data?.mensaje || "Error al cargar datos del perfil");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [tipoUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = tipoUsuario === "entrenador" 
        ? "/entrenadores/actualizar" 
        : "/usuarios/actualizar";

      const response = await api.put(endpoint, {
        nombre: formData.name,
        correo: formData.email,
        costoMensual: formData.costoMensual,
        costoSesion: formData.costoSesion
      });

      if (response.data.exito) {
        sessionStorage.setItem("nombre", formData.name);
        sessionStorage.setItem("correo", formData.email);
        if (tipoUsuario === "entrenador") {
          sessionStorage.setItem("costoMensualEntrenador", formData.costoMensual);
          sessionStorage.setItem("costoSesionEntrenador", formData.costoSesion);
        }
        
        setUser(formData);
        setIsEditing(false);
        alert("Perfil actualizado correctamente");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al actualizar perfil");
      console.error("Error al actualizar perfil:", err);
    }
  };

  const handleBajaGimnasio = async () => {
    if (!window.confirm("¿Seguro que deseas darte de baja del gimnasio?")) return;

    try {
      const id_entrenador = sessionStorage.getItem("idEntrenador");
      const response = await api.post("/entrenadores/baja-gym", {
        id_entrenador: parseInt(id_entrenador)
      });

      if (response.data.exito) {
        sessionStorage.removeItem("idGimEntrenador");
        alert("Te has dado de baja del gimnasio.");
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al darse de baja");
      console.error("Error al darse de baja:", err);
      alert("Error al darse de baja: " + (err.response?.data?.mensaje || err.message));
    }
  };

  if (loading) return <div className="profile-container loading"><div className="spinner"></div><p>Cargando perfil...</p></div>;
  if (error) return <div className="profile-container error"><p>Error: {error}</p><button onClick={() => window.location.reload()}>Reintentar</button></div>;

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-photo">
            <img
              src={user.photo || "/default-profile.jpg"}
              alt="Foto de perfil"
              onError={(e) => {
                e.target.src = "/default-profile.jpg";
              }}
            />
            {isEditing && (
              <button className="change-photo-btn">Cambiar foto</button>
            )}
          </div>
          <div className="profile-info">
            <h2>{user.name || "Usuario"}</h2>
            <p className="user-type">
              Tipo de usuario:{" "}
              {tipoUsuario === "entrenador"
                ? "Entrenador"
                : tipoUsuario === "cliente"
                ? user.rolCliente === "admin" 
                  ? "Administrador" 
                  : "Cliente"
                : "Desconocido"}
            </p>
            {gimnasioInfo && (
              <p className="gym-info">
                Gimnasio: {gimnasioInfo.nombre}
              </p>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {tipoUsuario === "entrenador" && (
              <>
                <div className="form-group">
                  <label>Costo Mensual:</label>
                  <input
                    type="number"
                    name="costoMensual"
                    value={formData.costoMensual || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Costo por Sesión:</label>
                  <input
                    type="number"
                    name="costoSesion"
                    value={formData.costoSesion || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="profile-actions">
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ ...user });
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>

            {tipoUsuario === "entrenador" && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Costo Mensual:</span>
                  <span className="detail-value">${user.costoMensual}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Costo por Sesión:</span>
                  <span className="detail-value">${user.costoSesion}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{user.telefono}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Edad:</span>
                  <span className="detail-value">{user.edad} años</span>
                </div>
              </>
            )}

            {tipoUsuario === "entrenador" && sessionStorage.getItem("idGimEntrenador") && (
              <button
                className="btn btn-danger"
                onClick={handleBajaGimnasio}
                disabled={loading}
              >
                Darme de baja del gimnasio
              </button>
            )}

            <div className="profile-actions">
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Editar perfil
              </button>
              <Link to="/mis-citas" className="btn btn-secondary">
                Ver mis citas
              </Link>
            </div>
          </div>
        )}

        {tipoUsuario === "entrenador" && solicitudes.length > 0 && (
          <div className="solicitudes-section">
            <h3>Mis solicitudes a gimnasios</h3>
            <div className="solicitudes-list">
              {solicitudes.map((s) => (
                <div key={s.id_solicitud} className="solicitud-card">
                  <h4>{s.nombre_gimnasio}</h4>
                  <p className={`estado-${s.estado.toLowerCase()}`}>
                    Estado: {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                  </p>
                  <p>Fecha solicitud: {new Date(s.fecha_solicitud).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;