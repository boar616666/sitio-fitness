import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/mis-citas.css";

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);
  const navigate = useNavigate();

  // Obtener el tipo de usuario para mostrar la información correcta
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  // Obtener datos del usuario desde sessionStorage
  useEffect(() => {
    if (!tipoUsuario) {
      // Si no hay usuario logueado, redirigir al login
      navigate("/login");
      return;
    }

    const fetchCitas = async () => {
      try {
        setLoading(true);

        // Preparar el cuerpo de la solicitud según el tipo de usuario
        let requestBody;

        if (tipoUsuario === "cliente") {
          const idUsuario = sessionStorage.getItem("idUsuario");
          requestBody = {
            rol: "cliente",
            id_usuario: parseInt(idUsuario),
          };
        } else if (tipoUsuario === "entrenador") {
          const idEntrenador = sessionStorage.getItem("idEntrenador");
          console.log("idEntrenador recuperado:", idEntrenador);
          requestBody = {
            rol: "entrenador",
            id_entrenador: parseInt(idEntrenador),
          };
        } else {
          throw new Error("Tipo de usuario no válido");
        }

        console.log("Enviando solicitud:", requestBody);

        const response = await fetch("/api/citas/mis-citas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Error al obtener las citas");
        }

        const data = await response.json();
        console.log("Citas recibidas:", data);

        // Verificar que los datos existen y son un array
        if (data.exito && Array.isArray(data.datos)) {
          setCitas(data.datos);
        } else {
          console.error("Formato de respuesta inesperado:", data);
          setCitas([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar las citas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, [navigate, actualizando, tipoUsuario]);

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

  // Aceptar cita (solo entrenadores)
  const aceptarCita = async (idCita) => {
    try {
      setActualizando(true);

      const idEntrenador = parseInt(sessionStorage.getItem("idEntrenador"));

      if (!idEntrenador) {
        throw new Error("No se pudo determinar el ID del entrenador");
      }

      const requestBody = {
        id_cita: idCita,
        estado: "confirmada",
        id_entrenador: idEntrenador,
      };

      console.log("Aceptando cita:", requestBody);

      const response = await fetch(
        "/api/citas/actualizar-estado",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Error al aceptar la cita");
      }

      const data = await response.json();

      if (!data.exito) {
        throw new Error(data.mensaje || "No se pudo aceptar la cita");
      }

      // Actualizar el estado local directamente
      const citasActualizadas = citas.map((cita) =>
        cita.id_cita === idCita ? { ...cita, estado: "confirmada" } : cita
      );
      setCitas(citasActualizadas);

      // Mostrar mensaje de éxito
      alert("Cita aceptada exitosamente");
    } catch (err) {
      setError(err.message);
      console.error("Error al aceptar la cita:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setActualizando(false);
    }
  };

  // Cancelar cita (según tipo de usuario)
  const cancelarCita = async (idCita) => {
    try {
      setActualizando(true);

      let response;
      let endpoint;
      let requestBody;

      // Diferentes endpoints según el tipo de usuario
      if (tipoUsuario === "cliente") {
        // Endpoint específico para clientes
        endpoint = "/api/citas/cancelar";
        const idUsuario = parseInt(sessionStorage.getItem("idUsuario"));

        requestBody = {
          id_usuario: idUsuario,
          id_cita: idCita,
        };
      } else if (tipoUsuario === "entrenador") {
        // Endpoint para entrenadores
        endpoint = "http://localhost:3000/citas/actualizar-estado";
        const idEntrenador = parseInt(sessionStorage.getItem("idEntrenador"));

        requestBody = {
          id_cita: idCita,
          estado: "cancelada",
          id_entrenador: idEntrenador,
        };
      } else {
        throw new Error("Tipo de usuario no válido");
      }

      console.log(`Cancelando cita (${tipoUsuario}):`, requestBody);

      response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Error al cancelar la cita");
      }

      const data = await response.json();

      if (!data.exito) {
        throw new Error(data.mensaje || "No se pudo cancelar la cita");
      }

      // Actualizar el estado local
      const citasActualizadas = citas.map((cita) =>
        cita.id_cita === idCita ? { ...cita, estado: "cancelada" } : cita
      );
      setCitas(citasActualizadas);

      // Mostrar mensaje de éxito
      alert("Cita cancelada exitosamente");
    } catch (err) {
      setError(err.message);
      console.error("Error al cancelar la cita:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setActualizando(false);
    }
  };

  const citasFiltradas =
    filtroEstado === "Todas"
      ? citas
      : citas.filter(
          (cita) =>
            cita.estado &&
            cita.estado.toLowerCase() === filtroEstado.toLowerCase()
        );

  if (loading) {
    return (
      <div className="mis-citas-container loading-container">
        <p>Cargando tus citas...</p>
      </div>
    );
  }

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
          </select>
        </div>
      </div>

      {citas.length > 0 ? (
        <div className="citas-lista">
          {citasFiltradas.map((cita) => (
            <div
              key={cita.id_cita}
              className={`cita-card estado-${
                cita.estado ? cita.estado.toLowerCase() : "pendiente"
              }`}
            >
              <div className="cita-gimnasio">
                <img
                  src={cita.imagen_gimnasio || ""}
                  alt="Gimnasio"
                  onError={(e) => {
                    (e.target.src = ""), (alt = "Foto gym");
                  }}
                />
                <h3>Cita #{cita.id_cita}</h3>
              </div>

              <div className="cita-detalles">
                <p>
                  <strong>Servicio:</strong> Entrenamiento personal
                </p>
                {tipoUsuario === "cliente" ? (
                  <p>
                    <strong>Entrenador:</strong>{" "}
                    {cita.nombre_entrenador ||
                      "Entrenador #" + cita.id_entrenador}
                  </p>
                ) : (
                  <p>
                    <strong>Cliente:</strong>{" "}
                    {cita.nombre_usuario ||
                      cita.correo_usuario ||
                      "Cliente #" + cita.id_usuario}
                  </p>
                )}
                <p>
                  <strong>Fecha:</strong> {formatearFecha(cita.fecha_hora)}
                </p>
                <p>
                  <strong>Hora:</strong> {formatearHora(cita.fecha_hora)}
                </p>
                <p
                  className={`cita-estado estado-${
                    cita.estado ? cita.estado.toLowerCase() : "pendiente"
                  }`}
                >
                  <strong>Estado:</strong>{" "}
                  {cita.estado
                    ? cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)
                    : "Pendiente"}
                </p>
              </div>

              <div className="cita-acciones">
                {tipoUsuario === "entrenador" &&
                  cita.estado === "pendiente" && (
                    <button
                      className="btn-aceptar"
                      onClick={() => aceptarCita(cita.id_cita)}
                      disabled={actualizando}
                    >
                      {actualizando ? "Procesando..." : "Aceptar cita"}
                    </button>
                  )}

                {(cita.estado === "pendiente" ||
                  cita.estado === "confirmada") && (
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
          <Link to="/citas" className="btn-agendar">
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
