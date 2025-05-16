import React, { useState, useEffect } from "react";
import "../styles/mis-citas.css"; // Puedes reutilizar estilos de MisCitas si quieres
import axios from "axios";

const SolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar solicitudes pendientes
  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3000/solicitudes/pendientes"
      );
      setSolicitudes(res.data.datos || []);
    } catch (err) {
      setError("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Aceptar o rechazar solicitud
  const responderSolicitud = async (id_solicitud, estado) => {
    try {
      setActualizando(true);
      const res = await axios.put(
        "http://localhost:3000/solicitudes/responder",
        { id_solicitud, estado }
      );
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id_solicitud === id_solicitud ? { ...s, estado } : s
        )
      );
      alert(res.data.mensaje || "Solicitud actualizada");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Obtener el id_entrenador de la solicitud rechazada
        const solicitud = solicitudes.find(
          (s) => s.id_solicitud === id_solicitud
        );
        const idEntrenador = solicitud?.id_entrenador;

        // Cambia a "rechazada" todas las solicitudes pendientes de ese entrenador
        setSolicitudes((prev) =>
          prev.map((s) =>
            s.id_entrenador === idEntrenador && s.estado === "pendiente"
              ? { ...s, estado: "rechazada" }
              : s
          )
        );
        alert(
          err.response.data.mensaje ||
            "El entrenador ya pertenece a un gimnasio. Solicitud rechazada automáticamente."
        );
      } else {
        setError("Error al actualizar la solicitud");
      }
    } finally {
      setActualizando(false);
    }
  };

  if (loading) {
    return (
      <div className="mis-citas-container loading-container">
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
        <h1>Solicitudes de Entrenadores</h1>
      </div>
      {solicitudes.length === 0 ? (
        <div className="no-citas">
          <p>No hay solicitudes pendientes.</p>
        </div>
      ) : (
        <div className="citas-lista">
          {solicitudes.map((s) => (
            <div
              key={s.id_solicitud}
              className={`cita-card estado-${s.estado}`}
            >
              <div className="cita-detalles">
                <p>
                  <strong>Entrenador:</strong> {s.nombre_entrenador}
                </p>
                <p>
                  <strong>Gimnasio:</strong> {s.nombre_gimnasio}
                </p>
                <p>
                  <strong>Fecha solicitud:</strong>{" "}
                  {new Date(s.fecha_solicitud).toLocaleString("es-MX")}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span className={`cita-estado estado-${s.estado}`}>
                    {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                  </span>
                </p>
              </div>
              <div className="cita-acciones">
                {s.estado === "pendiente" && (
                  <>
                    <button
                      className="btn-aceptar"
                      onClick={() =>
                        responderSolicitud(s.id_solicitud, "aceptada")
                      }
                      disabled={actualizando}
                    >
                      {actualizando ? "Procesando..." : "Aceptar"}
                    </button>
                    <button
                      className="btn-cancelar"
                      onClick={() =>
                        responderSolicitud(s.id_solicitud, "rechazada")
                      }
                      disabled={actualizando}
                    >
                      {actualizando ? "Procesando..." : "Rechazar"}
                    </button>
                  </>
                )}
                {s.estado !== "pendiente" && (
                  <span className="info-message">
                    Solicitud{" "}
                    {s.estado === "aceptada" ? "aceptada" : "rechazada"}
                  </span>
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
