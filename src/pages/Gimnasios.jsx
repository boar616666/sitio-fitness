import React, { useState, useEffect } from "react";
import axios from "axios";
import GimnasioCard from "../components/GimnasioCard";
import Breadcrumbs from "../components/Breadcrumbs";
import RegisterCallToAction from "../components/RegisterCallToAction";
import ScrollToTop from "../components/ScrollToTop";
import "../styles/gimnasios.css";

const Gimnasios = () => {
  const [gimnasios, setGimnasios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const fetchGimnasios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/gimnasios/listar");
      
      if (response.data.exito) {
        setGimnasios(response.data.datos);
      } else {
        throw new Error(response.data.mensaje || "No se pudieron cargar los gimnasios");
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!formData.nombre || !formData.direccion || !formData.hora_entrada || 
        !formData.hora_salida || !formData.descripcion) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await api.post("/gimnasios/crearGym", formData);
      
      if (response.data.exito) {
        // Actualizar la lista de gimnasios
        if (response.data.datos) {
          setGimnasios(prev => [...prev, response.data.datos]);
        } else {
          await fetchGimnasios();
        }

        // Limpiar formulario y cerrar modal
        setFormData({
          nombre: "",
          direccion: "",
          hora_entrada: "",
          hora_salida: "",
          descripcion: "",
        });
        setShowModal(false);
        alert("Gimnasio creado exitosamente");
      } else {
        throw new Error(response.data.mensaje || "Error al crear el gimnasio");
      }
    } catch (error) {
      console.error("Error al crear gimnasio:", error);
      alert(error.response?.data?.mensaje || "Error al crear el gimnasio. Verifica los datos.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id_gimnasio) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este gimnasio?")) {
      return;
    }

    try {
      const response = await api.delete(`/gimnasios/eliminar/${id_gimnasio}`);
      
      if (response.data.exito) {
        setGimnasios(prev => prev.filter(gym => gym.id_gimnasio !== id_gimnasio));
        alert("Gimnasio eliminado correctamente");
      } else {
        throw new Error(response.data.mensaje || "No se pudo eliminar el gimnasio");
      }
    } catch (error) {
      console.error("Error al eliminar gimnasio:", error);
      alert(error.response?.data?.mensaje || "Error al eliminar el gimnasio");
    }
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Cargando gimnasios...</p>
        </div>
      </div>
    );
  }

  // Resto del JSX sin cambios...
  return (
    <div className="gimnasios-container">
      <Breadcrumbs />
      <div className="gimnasios-header">
        <h1>Gimnasios Recomendados</h1>
        {rolCliente === "admin" && (
          <button 
            className="agregar-gym-btn"
            onClick={() => setShowModal(true)}
          >
            Agregar gimnasio
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchGimnasios}>Reintentar</button>
        </div>
      )}

      {!gimnasios || gimnasios.length === 0 ? (
        <div className="no-gimnasios">
          <p>No hay gimnasios disponibles</p>
          {rolCliente === "admin" && (
            <button 
              className="agregar-gym-btn"
              onClick={() => setShowModal(true)}
            >
              Agregar primer gimnasio
            </button>
          )}
        </div>
      ) : (
        <div className="gimnasios-list">
          {gimnasios.map((gimnasio) => (
            <GimnasioCard 
              key={gimnasio.id_gimnasio} 
              gimnasio={gimnasio}
              isAdmin={rolCliente === "admin"}
              onDelete={handleDelete}
            />
          ))}
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
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      <ScrollToTop />
    </div>
  );
};

export default Gimnasios;