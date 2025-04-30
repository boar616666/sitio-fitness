import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
    memberSince: "15 de enero de 2023",
    fitnessLevel: "Intermedio",
    preferredActivities: ["Pesas", "Yoga", "Running"],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    // Obtener datos del usuario desde sessionStorage
    const tipoUsuario = sessionStorage.getItem("tipoUsuario");
    const nombre = sessionStorage.getItem("nombre");
    const correo = sessionStorage.getItem("correo");
    const foto = sessionStorage.getItem("foto");

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
    } else if (tipoUsuario === "cliente") {
      const rolCliente = sessionStorage.getItem("rolCliente");
      setUser({
        name: nombre,
        email: correo,
        photo: foto,
        rolCliente,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la llamada a la API para actualizar el perfil
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-photo">
            <img
              src={user.photo || "https://via.placeholder.com/150"}
              alt="Foto de perfil"
            />
          </div>
          <div className="profile-info">
            <h2>{user.name || "Usuario Ejemplo"}</h2>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

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
      </div>
    </div>
  );
};

export default Profile;
