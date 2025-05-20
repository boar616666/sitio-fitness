import React, { useState, useEffect } from "react";
import axios from "axios";
import GimnasioCard from "../components/GimnasioCard";
import Breadcrumbs from "../components/Breadcrumbs";
import RegisterCallToAction from "../components/RegisterCallToAction";
import ScrollToTop from "../components/ScrollToTop";

const Gimnasios = () => {
  const [gimnasios, setGimnasios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    hora_entrada: "",
    hora_salida: "",
    descripcion: "",
  });

  const rolCliente = sessionStorage.getItem("rolCliente");
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  // Configura Axios para usar la URL base desde las variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});


  const fetchGimnasios = async () => {
    try {
      setLoading(true);
      const response = await api.get("/listar");
      
      if (response.data.exito) {
        setGimnasios(response.data.datos);
      } else {
        setError(response.data.mensaje || "No se pudieron cargar los gimnasios");
      }
    } catch (error) {
      console.error("Error al cargar gimnasios:", error);
      setError(error.response?.data?.mensaje || "Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGimnasios();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/crearGym", formData);
      
      if (response.data.exito) {
        setShowModal(false);
        await fetchGimnasios(); // Espera a que se recarguen los gimnasios
        setFormData({
          nombre: "",
          direccion: "",
          hora_entrada: "",
          hora_salida: "",
          descripcion: "",
        });
      } else {
        setError(response.data.mensaje || "Error al crear el gimnasio");
      }
    } catch (error) {
      console.error("Error al crear el gym: ", error);
      setError(error.response?.data?.mensaje || "Error al crear el gimnasio. Verifica los datos.");
    }
  };

  if (loading) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <div className="loading-indicator">
          <p>Cargando gimnasios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchGimnasios}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!gimnasios || gimnasios.length === 0) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <p>No hay gimnasios disponibles</p>
        {rolCliente === "admin" && (
          <button className="agregar-gym-btn" onClick={() => setShowModal(true)}>
            Agregar primer gimnasio
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="gimnasios-container">
      <Breadcrumbs />
      <div className="gimnasios-header">
        <h1>Gimnasios Recomendados</h1>

        {rolCliente === "admin" && (
          <button className="agregar-gym-btn" onClick={() => setShowModal(true)}>
            Agregar gimnasio
          </button>
        )}
      </div>

      <p className="gimnasios-description">
        Encuentra los mejores gimnasios cerca de ti.
      </p>

      <div className="gimnasios-list">
        {gimnasios.map((gimnasio) => (
          <GimnasioCard key={gimnasio.id_gimnasio} gimnasio={gimnasio} />
        ))}
      </div>

      {!tipoUsuario && (
        <div className="gimnasios-cta-section">
          <RegisterCallToAction
            title="¿Eres entrenador?"
            description="Registra tu perfil como entrenador y conéctate con nuevos clientes en cualquiera de nuestros gimnasios asociados."
            buttonText="Regístrate como entrenador"
            type="entrenador"
          />
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Nuevo Gimnasio</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora de Entrada:</label>
                <input
                  type="time"
                  name="hora_entrada"
                  value={formData.hora_entrada}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora de Salida:</label>
                <input
                  type="time"
                  name="hora_salida"
                  value={formData.hora_salida}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  Guardar
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
};

export default Gimnasios;