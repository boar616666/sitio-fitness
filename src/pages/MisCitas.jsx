import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/mis-citas.css";

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);
  const navigate = useNavigate();

  // Obtener el tipo de usuario
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  // Efecto para cargar las citas
  useEffect(() => {
    if (!tipoUsuario) {
      navigate("/login");
      return;
    }

    const fetchCitas = async () => {
      try {
        setLoading(true);
        setError(null);

        let requestBody = {};
        // Ruta corregida: eliminar /api/
        const endpoint = "/citas/mis-citas";

        if (tipoUsuario === "cliente") {
          const idUsuario = sessionStorage.getItem("idUsuario");
          requestBody = {
            rol: "cliente",
            id_usuario: parseInt(idUsuario),
          };
        } else if (tipoUsuario === "entrenador") {
          const idEntrenador = sessionStorage.getItem("idEntrenador");
          requestBody = {
            rol: "entrenador",
            id_entrenador: parseInt(idEntrenador),
          };
        } else {
          throw new Error("Tipo de usuario no válido");
        }

        const response = await api.post(endpoint, requestBody);

        if (response.data.exito && Array.isArray(response.data.datos)) {
          setCitas(response.data.datos);
        } else {
          throw new Error(response.data.mensaje || "Formato de respuesta inesperado");
        }
      } catch (err) {
        setError(err.response?.data?.mensaje || err.message);
        console.error("Error al cargar citas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, [navigate, actualizando, tipoUsuario]);

  // Funciones para formatear fecha y hora
  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha no disponible";
    }
  };

  const formatearHora = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error al formatear hora:", error);
      return "Hora no disponible";
    }
  };

  // Función para aceptar cita (entrenadores)
  const aceptarCita = async (idCita) => {
    try {
      setActualizando(true);
      const idEntrenador = parseInt(sessionStorage.getItem("idEntrenador"));

      if (!idEntrenador) {
        throw new Error("No se pudo determinar el ID del entrenador");
      }

      // Ruta corregida
      const response = await api.put("/citas/actualizar-estado", {
        id_cita: idCita,
        estado: "confirmada",
        id_entrenador: idEntrenador,
      });

      if (response.data.exito) {
        setCitas(citas.map(cita => 
          cita.id_cita === idCita ? { ...cita, estado: "confirmada" } : cita
        ));
        alert("Cita aceptada exitosamente");
      } else {
        throw new Error(response.data.mensaje || "No se pudo aceptar la cita");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message);
      console.error("Error al aceptar cita:", err);
      alert(`Error: ${err.response?.data?.mensaje || err.message}`);
    } finally {
      setActualizando(false);
    }
  };

  // Función para cancelar cita
  const cancelarCita = async (idCita) => {
    try {
      setActualizando(true);
      let endpoint, requestBody;

      if (tipoUsuario === "cliente") {
        // Ruta corregida
        endpoint = "/citas/cancelar";
        requestBody = {
          id_usuario: parseInt(sessionStorage.getItem("idUsuario")),
          id_cita: idCita,
        };
      } else if (tipoUsuario === "entrenador") {
        // Ruta corregida
        endpoint = "/citas/actualizar-estado";
        requestBody = {
          id_cita: idCita,
          estado: "cancelada",
          id_entrenador: parseInt(sessionStorage.getItem("idEntrenador")),
        };
      } else {
        throw new Error("Tipo de usuario no válido");
      }

      const response = await api.put(endpoint, requestBody);

      if (response.data.exito) {
        setCitas(citas.map(cita => 
          cita.id_cita === idCita ? { ...cita, estado: "cancelada" } : cita
        ));
        alert("Cita cancelada exitosamente");
      } else {
        throw new Error(response.data.mensaje || "No se pudo cancelar la cita");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message);
      console.error("Error al cancelar cita:", err);
      alert(`Error: ${err.response?.data?.mensaje || err.message}`);
    } finally {
      setActualizando(false);
    }
  };

  // Filtrar citas según estado seleccionado
  const citasFiltradas = filtroEstado === "Todas" 
    ? citas 
    : citas.filter(cita => cita.estado?.toLowerCase() === filtroEstado.toLowerCase());

  // Renderizado durante carga
  if (loading) {
    return (
      <div className="mis-citas-container loading-container">
        <div className="spinner"></div>
        <p>Cargando tus citas...</p>
      </div>
    );
  }

  // Renderizado en caso de error
  if (error) {
    return (
      <div className="mis-citas-container error-container">
        <p>Error: {error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="mis-citas-container">
      <div className="citas-header">
        <h1>Mis Citas</h1>
        <Link to="/profile" className="btn-volver">
          Volver al perfil
        </Link>
      </div>

      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="Todas">Todas</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelada">Canceladas</option>
            <option value="completada">Completadas</option>
          </select>
        </div>
      </div>

      {citasFiltradas.length > 0 ? (
        <div className="citas-lista">
          {citasFiltradas.map((cita) => (
            <div
              key={cita.id_cita}
              className={`cita-card estado-${cita.estado?.toLowerCase() || "pendiente"}`}
            >
              <div className="cita-gimnasio">
                <img
                  src={cita.imagen_gimnasio || "/default-gym.jpg"}
                  alt="Gimnasio"
                  onError={(e) => {
                    e.target.src = "/default-gym.jpg";
                  }}
                />
                <h3>Cita #{cita.id_cita}</h3>
              </div>

              <div className="cita-detalles">
                <p><strong>Servicio:</strong> {cita.tipo_servicio || "Entrenamiento personal"}</p>
                {tipoUsuario === "cliente" ? (
                  <p><strong>Entrenador:</strong> {cita.nombre_entrenador || `Entrenador #${cita.id_entrenador}`}</p>
                ) : (
                  <p><strong>Cliente:</strong> {cita.nombre_usuario || cita.correo_usuario || `Cliente #${cita.id_usuario}`}</p>
                )}
                <p><strong>Fecha:</strong> {formatearFecha(cita.fecha_hora)}</p>
                <p><strong>Hora:</strong> {formatearHora(cita.fecha_hora)}</p>
                <p className={`cita-estado estado-${cita.estado?.toLowerCase() || "pendiente"}`}>
                  <strong>Estado:</strong> {cita.estado ? cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1) : "Pendiente"}
                </p>
              </div>

              <div className="cita-acciones">
                {tipoUsuario === "entrenador" && cita.estado === "pendiente" && (
                  <button
                    className="btn-aceptar"
                    onClick={() => aceptarCita(cita.id_cita)}
                    disabled={actualizando}
                  >
                    {actualizando ? "Procesando..." : "Aceptar cita"}
                  </button>
                )}

                {(cita.estado === "pendiente" || cita.estado === "confirmada") && (
                  <button
                    className="btn-cancelar"
                    onClick={() => cancelarCita(cita.id_cita)}
                    disabled={actualizando}
                  >
                    {actualizando ? "Procesando..." : "Cancelar cita"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-citas">
          <p>No tienes citas programadas con el filtro seleccionado.</p>
          <Link to="/gimnasios" className="btn-agendar">
            Agendar una cita
          </Link>
        </div>
      )}

      {tipoUsuario === "cliente" && (
        <div className="citas-footer">
          <Link to="/gimnasios" className="btn-agendar-nueva">
            Agendar nueva cita
          </Link>
        </div>
      )}
    </div>
  );
};

export default MisCitas;