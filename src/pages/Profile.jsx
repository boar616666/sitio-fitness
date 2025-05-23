import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";
import axios from "axios";

const Profile = () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");
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
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Obtener datos del usuario desde sessionStorage
      const tipoUsuario = sessionStorage.getItem("tipoUsuario");
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

        try {
          const response = await axios.get(
            `http://localhost:3000/gimnasios/${idGimnasio}`
          );
          console.log("Datos del gimnasio:", response.data);
        } catch (error) {
          console.error("Error al obtener datos del gimnasio:", error);
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
    };

    fetchData();
  }, []);

  useEffect(() => {
    const idEntrenador = sessionStorage.getItem("idEntrenador");
    if (!idEntrenador) return;
    axios.get("http://localhost:3000/solicitudes/pendientes").then((res) => {
      setSolicitudes(
        res.data.datos.filter((s) => s.id_entrenador === parseInt(idEntrenador))
      );
    });
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
            <p style={{ fontWeight: 500, color: "#800020", margin: "8px 0 0 0" }}>
              Tipo de usuario:{" "}
              {tipoUsuario === "entrenador"
                ? "Entrenador"
                : tipoUsuario === "cliente"
                  ? (user.rolCliente === "admin" ? "Administrador" : "Cliente")
                  : "Desconocido"}
            </p>
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

            {/* Botón para darse de baja del gimnasio */}
            {sessionStorage.getItem("tipoUsuario") === "entrenador" &&
              sessionStorage.getItem("idGimEntrenador") && (
                <button
                  className="btn btn-danger"
                  style={{ margin: "12px 0", background: "#e74c3c" }}
                  onClick={async () => {
                    if (
                      window.confirm(
                        "¿Seguro que deseas darte de baja del gimnasio?"
                      )
                    ) {
                      try {
                        const id_entrenador =
                          sessionStorage.getItem("idEntrenador");
                        const res = await fetch(
                          "http://localhost:3000/entrenadores/baja-gym",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id_entrenador }),
                          }
                        );
                        const data = await res.json();
                        if (data.exito) {
                          alert("Te has dado de baja del gimnasio.");
                          sessionStorage.removeItem("idGimEntrenador");
                          window.location.reload();
                        } else {
                          alert("No se pudo realizar la baja.");
                        }
                      } catch {
                        alert("Error al darse de baja.");
                      }
                    }
                  }}
                >
                  Darme de baja del gimnasio
                </button>
              )}

            {/*             <div className="profile-actions">
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Editar perfil
              </button>
              <Link to="/mis-citas" className="btn btn-secondary">
                Ver mis citas
              </Link>
            </div> */}
          </div>
        )}

        {tipoUsuario === "entrenador" && (
          <div>
            <h3>Mis solicitudes a gimnasios</h3>
            <ul>
              {solicitudes.map((s) => (
                <li key={s.id_solicitud}>
                  {s.nombre_gimnasio}: {s.estado}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
