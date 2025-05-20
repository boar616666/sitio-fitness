import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";
import ScrollToTop from "../components/ScrollToTop";

// Configuración de Axios con variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función para extraer el ID de YouTube de la URL
function getYoutubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [nuevoVideo, setNuevoVideo] = useState({ categoria: "", url: "" });
  const [publicando, setPublicando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [entrenadores, setEntrenadores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id_entrenador = sessionStorage.getItem("idEntrenador");
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");
  const rolCliente = sessionStorage.getItem("rolCliente");

  const categorias = [
    "Pecho", "Espalda", "Piernas", "Abdomen", "Full Body",
    "Cardio", "Brazos", "Glúteos", "HIIT", "Estiramiento"
  ];

  const navigate = useNavigate();

  // Cargar todos los videos y entrenadores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener videos
        const videosResponse = await api.get("/api/videos/todos");
        if (!videosResponse.data.exito) {
          throw new Error(videosResponse.data.mensaje || "Error al cargar videos");
        }

        const videosData = videosResponse.data.datos;
        setVideos(videosData);

        // Obtener datos de entrenadores
        const idsEntrenadores = [...new Set(videosData.map(v => v.id_entrenador))];
        const entrenadoresData = {};

        await Promise.all(
          idsEntrenadores.map(async (id) => {
            try {
              const res = await api.get(`/api/entrenadores/${id}`);
              if (res.data.exito) {
                entrenadoresData[id] = res.data.datos;
              }
            } catch (err) {
              console.error(`Error al cargar entrenador ${id}:`, err);
            }
          })
        );

        setEntrenadores(entrenadoresData);
      } catch (err) {
        setError(err.response?.data?.mensaje || err.message);
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar videos por categoría o URL
  const filteredVideos = videos.filter((video) =>
    (video.categoria || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.url || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Publicar un nuevo video
  const handlePublicar = async (e) => {
    e.preventDefault();
    setPublicando(true);
    setMensaje("");

    try {
      const response = await api.post("/api/videos/publicar", {
        id_entrenador,
        categoria: nuevoVideo.categoria,
        url: nuevoVideo.url
      });

      if (response.data.exito) {
        setMensaje("¡Video publicado con éxito!");
        setNuevoVideo({ categoria: "", url: "" });
        // Actualizar lista de videos
        const res = await api.get("/api/videos/todos");
        if (res.data.exito) {
          setVideos(res.data.datos);
        }
      } else {
        throw new Error(response.data.mensaje || "Error al publicar el video");
      }
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || err.message);
      console.error("Error al publicar video:", err);
    } finally {
      setPublicando(false);
    }
  };

  // Eliminar video
  const handleEliminar = async (id_video) => {
    if (!window.confirm("¿Seguro que deseas eliminar este video?")) return;
    
    try {
      const response = await api.post("/api/videos/eliminar", {
        id_video,
        id_entrenador
      });

      if (response.data.exito) {
        setVideos(prev => prev.filter(v => v.id_video !== id_video));
      } else {
        throw new Error(response.data.mensaje || "No se pudo eliminar el video");
      }
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al eliminar el video");
      console.error("Error al eliminar video:", err);
    }
  };

  if (loading) {
    return (
      <div className="content-container">
        <Breadcrumbs />
        <div className="loading-indicator">
          <p>Cargando videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <Breadcrumbs />
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <Breadcrumbs />
      <h2>Videos de Entrenamiento</h2>

      {/* Formulario para publicar video (solo entrenadores) */}
      {tipoUsuario === "entrenador" && (
        <form onSubmit={handlePublicar} className="publicar-video-form">
          <h3>Publicar nuevo video</h3>
          <div className="form-row">
            <select
              value={nuevoVideo.categoria}
              onChange={e => setNuevoVideo({ ...nuevoVideo, categoria: e.target.value })}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="URL de YouTube"
              value={nuevoVideo.url}
              onChange={e => setNuevoVideo({ ...nuevoVideo, url: e.target.value })}
              required
              pattern="https?://.+"
            />
            <button type="submit" disabled={publicando}>
              {publicando ? "Publicando..." : "Publicar"}
            </button>
          </div>
          {mensaje && <div className="mensaje-publicar">{mensaje}</div>}
        </form>
      )}

      {/* Barra de búsqueda */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar videos por categoría o URL..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Lista de videos */}
      <div className="videos-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => {
            const youtubeId = getYoutubeId(video.url);
            const entrenador = entrenadores[video.id_entrenador];
            const esPropio = 
              (tipoUsuario === "entrenador" && String(video.id_entrenador) === String(id_entrenador)) ||
              (tipoUsuario === "cliente" && rolCliente === "admin");

            return (
              <div key={video.id_video} className="video-card">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <div className="video-thumbnail">
                    {youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                        alt={video.categoria}
                      />
                    ) : (
                      <div className="video-placeholder"></div>
                    )}
                  </div>
                  <div className="video-info">
                    <h3>{video.categoria}</h3>
                    {entrenador && (
                      <div className="video-entrenador">
                        <img src={entrenador.foto || "/default-profile.jpg"} alt={entrenador.nombre} />
                        <span>{entrenador.nombre}</span>
                      </div>
                    )}
                  </div>
                </a>
                {esPropio && (
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleEliminar(video.id_video)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No se encontraron videos con "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")}>
              Mostrar todos los videos
            </button>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Videos;