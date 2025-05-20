import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/mis-citas.css"; // Reutilizando estilos de MisCitas

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

const SolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("pendiente"); // Filtro por defecto

  // Cargar solicitudes
  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/api/solicitudes/pendientes");
      
      if (response.data.exito) {
        setSolicitudes(response.data.datos || []);
      } else {
        throw new Error(response.data.mensaje || "Error al obtener solicitudes");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message);
      console.error("Error al cargar solicitudes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Filtrar solicitudes según estado seleccionado
  const solicitudesFiltradas = filtro === "todas" 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtro);

  // Responder a una solicitud (aceptar/rechazar)
  const responderSolicitud = async (id_solicitud, estado) => {
    try {
      setActualizando(true);
      setError(null);
      
      const response = await api.put("/api/solicitudes/responder", {
        id_solicitud,
        estado
      });

      if (response.data.exito) {
        // Actualizar el estado local
        setSolicitudes(prev => prev.map(s => 
          s.id_solicitud === id_solicitud ? { ...s, estado } : s
        ));
        
        // Mostrar mensaje de éxito
        alert(response.data.mensaje || `Solicitud ${estado} correctamente`);
      } else {
        throw new Error(response.data.mensaje || "Error al procesar la solicitud");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        // Manejar caso donde el entrenador ya pertenece a otro gimnasio
        const idEntrenador = solicitudes.find(s => s.id_solicitud === id_solicitud)?.id_entrenador;
        
        if (idEntrenador) {
          // Rechazar automáticamente todas las solicitudes pendientes de este entrenador
          setSolicitudes(prev => prev.map(s => 
            s.id_entrenador === idEntrenador && s.estado === "pendiente" 
              ? { ...s, estado: "rechazada" } 
              : s
          ));
        }
        
        alert(err.response?.data?.mensaje || "El entrenador ya pertenece a otro gimnasio. Solicitudes rechazadas.");
      } else {
        setError(err.response?.data?.mensaje || err.message);
        console.error("Error al responder solicitud:", err);
      }
    } finally {
      setActualizando(false);
    }
  };

  // Formatear fecha legible
  const formatFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  if (loading) {
    return (
      <div className="mis-citas-container loading-container">
        <div className="spinner"></div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-citas-container error-container">
        <p>Error: {error}</p>
        <button className="btn-retry" onClick={fetchSolicitudes}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="mis-citas-container">
      <div className="citas-header">
        <h1>Gestión de Solicitudes</h1>
        
        <div className="filtros-container">
          <div className="filtro-grupo">
            <label>Filtrar por estado:</label>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-select"
            >
              <option value="pendiente">Pendientes</option>
              <option value="aceptada">Aceptadas</option>
              <option value="rechazada">Rechazadas</option>
              <option value="todas">Todas</option>
            </select>
          </div>
        </div>
      </div>

      {solicitudesFiltradas.length === 0 ? (
        <div className="no-citas">
          <p>No hay solicitudes {filtro === "todas" ? "" : filtro}.</p>
        </div>
      ) : (
        <div className="citas-lista">
          {solicitudesFiltradas.map((solicitud) => (
            <div
              key={solicitud.id_solicitud}
              className={`cita-card estado-${solicitud.estado}`}
            >
              <div className="cita-detalles">
                <h3>Solicitud #{solicitud.id_solicitud}</h3>
                
                <div className="detail-item">
                  <span className="detail-label">Entrenador:</span>
                  <span className="detail-value">{solicitud.nombre_entrenador}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Gimnasio:</span>
                  <span className="detail-value">{solicitud.nombre_gimnasio}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{formatFecha(solicitud.fecha_solicitud)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Estado:</span>
                  <span className={`detail-value estado-${solicitud.estado}`}>
                    {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                  </span>
                </div>
              </div>

              <div className="cita-acciones">
                {solicitud.estado === "pendiente" && (
                  <>
                    <button
                      className="btn-aceptar"
                      onClick={() => responderSolicitud(solicitud.id_solicitud, "aceptada")}
                      disabled={actualizando}
                    >
                      {actualizando ? "Procesando..." : "Aceptar"}
                    </button>
                    <button
                      className="btn-cancelar"
                      onClick={() => responderSolicitud(solicitud.id_solicitud, "rechazada")}
                      disabled={actualizando}
                    >
                      {actualizando ? "Procesando..." : "Rechazar"}
                    </button>
                  </>
                )}
                
                {solicitud.estado !== "pendiente" && (
                  <p className="info-message">
                    Solicitud {solicitud.estado === "aceptada" ? "aceptada" : "rechazada"} el {formatFecha(solicitud.fecha_respuesta)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolicitudesAdmin;