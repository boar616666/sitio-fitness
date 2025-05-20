import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import RegisterCallToAction from "../components/RegisterCallToAction";
import AppointmentModal from "../components/AppointmentModal";
import ScrollToTop from "../components/ScrollToTop";

// Configuración de Axios para usar la URL base desde las variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});


// Componentes de íconos SVG
const IconEdad = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-1v6l5.25 3.15.75-1.23-5-3V7z" />
  </svg>
);

const IconTelefono = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const IconSesion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
  </svg>
);

const IconMensualidad = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
  </svg>
);

const IconAgendarCita = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
  </svg>
);

const GimnasioDetalle = () => {
  const { id } = useParams();
  const [gimnasio, setGimnasio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entrenadores, setEntrenadores] = useState([]);
  const [loadingEntrenadores, setLoadingEntrenadores] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEntrenador, setSelectedEntrenador] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id_gimnasio: "",
    nombre: "",
    direccion: "",
    hora_entrada: "",
    hora_salida: "",
    descripcion: "",
  });
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const idEntrenador = sessionStorage.getItem("idEntrenador");
  const rolCliente = sessionStorage.getItem("rolCliente");
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  // URLs de imágenes predeterminadas
  const imagenPredeterminada = "https://img.freepik.com/foto-gratis/gimnasio-luz-gimnasio-equipos-moderno_124507-14735.jpg";
  const fotoPredeterminada = "https://img.freepik.com/foto-gratis/entrenador-guapo-gimnasio_144627-36228.jpg";

  // Efecto para cargar los datos del usuario actual
  useEffect(() => {
    const obtenerUsuarioActual = () => {
      try {
        const idUsuario = sessionStorage.getItem("idUsuario");
        const nombre = sessionStorage.getItem("nombre");
        const correo = sessionStorage.getItem("correo");

        if (idUsuario) {
          setUsuarioActual({
            idUsuario: parseInt(idUsuario),
            nombre,
            correo,
          });
          return;
        }

        const usuarioString = sessionStorage.getItem("usuario");
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          setUsuarioActual(usuario);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    obtenerUsuarioActual();
  }, []);

  // Efecto para cargar los detalles del gimnasio
  useEffect(() => {
    const fetchGimnasioDetalle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/${id}`);

        if (response.data.exito) {
          setGimnasio(response.data.datos);
          fetchEntrenadores(response.data.datos.id_gimnasio);
        } else {
          setError(response.data.mensaje || "No se pudo cargar la información del gimnasio");
        }
      } catch (error) {
        setError(error.response?.data?.mensaje || "Error de conexión al servidor");
        console.error("Error al cargar detalles del gimnasio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGimnasioDetalle();
  }, [id]);

  // Función para cargar los entrenadores del gimnasio
  const fetchEntrenadores = async (idGimnasio) => {
    try {
      setLoadingEntrenadores(true);
      const response = await api.post("/api/entrenadores/por-gym", {
        id_gimnasio: idGimnasio
      });

      if (response.data.exito) {
        setEntrenadores(response.data.datos);
      } else {
        console.error("Error al cargar entrenadores:", response.data.mensaje);
      }
    } catch (error) {
      console.error("Error al cargar entrenadores:", error.response?.data || error.message);
    } finally {
      setLoadingEntrenadores(false);
    }
  };

  // Función para verificar si ya existe una solicitud
  const verificarSolicitudExistente = async () => {
    if (tipoUsuario === "entrenador" && idEntrenador && gimnasio?.id_gimnasio) {
      try {
        const response = await api.get(`/api/solicitudes/entrenador/${idEntrenador}`);
        const yaSolicitada = response.data.datos.some(
          s => s.id_gimnasio === gimnasio.id_gimnasio && s.estado !== "rechazada"
        );
        setSolicitudEnviada(yaSolicitada);
      } catch (error) {
        console.error("Error al verificar solicitud:", error.response?.data || error.message);
      }
    }
  };

  // Efecto para verificar solicitud existente cuando cambia el gimnasio
  useEffect(() => {
    if (gimnasio) verificarSolicitudExistente();
  }, [gimnasio]);

  // Efecto para actualizar el formulario cuando cambian los datos del gimnasio
  useEffect(() => {
    if (gimnasio) {
      setFormData({
        id_gimnasio: gimnasio.id_gimnasio,
        nombre: gimnasio.nombre,
        direccion: gimnasio.direccion,
        hora_entrada: gimnasio.hora_entrada,
        hora_salida: gimnasio.hora_salida,
        descripcion: gimnasio.descripcion,
      });
    }
  }, [gimnasio]);

  // Función para manejar el envío de solicitud de ingreso
  const handleSolicitarIngreso = async () => {
    if (!idEntrenador || !gimnasio?.id_gimnasio) return;

    try {
     const response = await api.post("/solicitar", {
        id_entrenador: parseInt(idEntrenador),
        id_gimnasio: gimnasio.id_gimnasio,
      });

      if (response.data.exito) {
        setSolicitudEnviada(true);
        alert("Solicitud enviada correctamente");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setSolicitudEnviada(true);
        alert("Ya has enviado una solicitud para este gimnasio.");
      } else {
        alert("Error al enviar la solicitud");
        console.error("Error:", error.response?.data || error.message);
      }
    }
  };

  // Función para manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para actualizar los datos del gimnasio
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
     const response = await api.put("/actualizar", formData);

      if (response.data.exito) {
        setShowEditModal(false);
        setGimnasio({
          ...gimnasio,
          ...formData,
        });
      } else {
        setError(response.data.mensaje || "Error al actualizar el gimnasio");
      }
    } catch (error) {
      console.error("Error al actualizar el gimnasio:", error);
      setError(error.response?.data?.mensaje || "Error al actualizar el gimnasio");
    }
  };

  // Función para abrir el modal de agendar cita
  const openModal = (idEntrenador) => {
    if (!usuarioActual || !usuarioActual.idUsuario) {
      alert("Debes iniciar sesión para agendar una cita");
      return;
    }

    setSelectedEntrenador(idEntrenador);
    setModalIsOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEntrenador(null);
  };

  // Renderizado durante la carga
  if (loading) {
    return (
      <div className="gimnasio-detalle-container">
        <div className="loading-indicator">
          <p>Cargando información del gimnasio...</p>
        </div>
      </div>
    );
  }

  // Renderizado en caso de error
  if (error || !gimnasio) {
    return (
      <div className="gimnasio-detalle-container">
        <div className="error-message">
          <p>{error || "No se pudo encontrar el gimnasio solicitado"}</p>
          <Link to="/gimnasios" className="button">
            Volver a la lista de gimnasios
          </Link>
        </div>
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="gimnasio-detalle-container">
      <div className="gimnasio-detalle-box">
        <Breadcrumbs />

        <div className="gimnasio-header">
          <h1>{gimnasio.nombre}</h1>
        </div>

        {rolCliente === "admin" && (
          <button className="editar-gym-btn" onClick={() => setShowEditModal(true)}>
            Editar Gimnasio
          </button>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Editar Gimnasio</h2>
              <form onSubmit={handleUpdate}>
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
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="gimnasio-info-section">
          <p>
            <strong>Dirección:</strong> {gimnasio.direccion}
          </p>
          <p>
            <strong>Horario:</strong> {gimnasio.hora_entrada} - {gimnasio.hora_salida}
          </p>

          <div className="gimnasio-descripcion">
            <h2>Descripción</h2>
            <p>{gimnasio.descripcion}</p>
          </div>

          {gimnasio.total_entrenadores && (
            <p>
              <strong>Entrenadores disponibles:</strong> {gimnasio.total_entrenadores}
            </p>
          )}
        </div>

        <div className="gimnasio-fotos">
          <img
            src={gimnasio.imagen || imagenPredeterminada}
            alt={gimnasio.nombre}
            onError={(e) => {
              e.target.src = imagenPredeterminada;
            }}
          />
        </div>

        <div className="gimnasio-entrenadores">
          <h2>Entrenadores</h2>
          {loadingEntrenadores ? (
            <p>Cargando entrenadores...</p>
          ) : entrenadores && entrenadores.length > 0 ? (
            <div className="entrenadores-grid">
              {entrenadores.map((entrenador) => (
                <div key={entrenador.id_entrenador} className="entrenador-card">
                  <div className="entrenador-banner"></div>
                  <div className="entrenador-imagen-container">
                    <img
                      src={entrenador.foto || fotoPredeterminada}
                      alt={entrenador.nombre}
                      className="entrenador-imagen"
                      onError={(e) => {
                        e.target.src = fotoPredeterminada;
                      }}
                    />
                  </div>
                  <h3>{entrenador.nombre}</h3>
                  <span className="entrenador-cargo">Entrenador Personal</span>
                  <span className="entrenador-estado">Disponible</span>

                  <div className="entrenador-info">
                    <span>
                      <IconEdad />
                      <strong>Edad:</strong> {entrenador.edad} años
                    </span>
                    <span>
                      <IconTelefono />
                      <strong>Teléfono:</strong> {entrenador.telefono}
                    </span>
                    <span>
                      <IconSesion />
                      <strong>Costo por sesión:</strong> ${entrenador.costo_sesion}
                    </span>
                    <span>
                      <IconMensualidad />
                      <strong>Mensualidad:</strong> ${entrenador.costo_mensual}
                    </span>
                  </div>

                  {rolCliente === "cliente" && (
                    <div className="entrenador-acciones">
                      <button
                        onClick={() => openModal(entrenador.id_entrenador)}
                        className="ver-detalles-btn"
                      >
                        <IconAgendarCita />
                        Agendar cita
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay entrenadores disponibles en este gimnasio.</p>
          )}
        </div>

        {!tipoUsuario && (
          <div className="gimnasios-cta-section">
            <RegisterCallToAction
              title="¿Eres entrenador?"
              description={`Registra tu perfil como entrenador en ${gimnasio.nombre} y conéctate con nuevos clientes.`}
              buttonText="Registrarme como entrenador"
              type="entrenador"
            />
          </div>
        )}

        {tipoUsuario === "entrenador" && !solicitudEnviada && (
          <button onClick={handleSolicitarIngreso} className="button">
            Solicitar ingreso a este gimnasio
          </button>
        )}
        {tipoUsuario === "entrenador" && solicitudEnviada && (
          <p className="info-message">
            Ya has enviado una solicitud para este gimnasio. Espera la respuesta
            del administrador.
          </p>
        )}

        <div className="gimnasio-footer">
          <Link to="/gimnasios" className="button">
            Volver a la lista de gimnasios
          </Link>
        </div>
      </div>
      
      <AppointmentModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        idUsuario={usuarioActual ? usuarioActual.idUsuario : null}
        idEntrenador={selectedEntrenador}
      />
      
      <ScrollToTop />
    </div>
  );
};

export default GimnasioDetalle;