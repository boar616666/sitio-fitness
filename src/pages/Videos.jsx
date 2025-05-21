import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";
import ScrollToTop from "../components/ScrollToTop";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-gimnasio-lu0e.onrender.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const videosResponse = await api.get("/videos/todos");
        
        if (!videosResponse.data.exito) {
          throw new Error(videosResponse.data.mensaje || "Error al cargar videos");
        }

        const videosData = videosResponse.data.datos;
        setVideos(videosData);

        const idsEntrenadores = [...new Set(videosData.map(v => v.id_entrenador))];
        const entrenadoresData = {};

        await Promise.all(
          idsEntrenadores.map(async (id) => {
            try {
              const res = await api.get(`/entrenadores/${id}`);
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
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredVideos = videos.filter((video) =>
    video.categoria?.toLowerCase().includes(searchQuery) ||
    video.url?.toLowerCase().includes(searchQuery)
  );

  const handlePublicar = async (e) => {
    e.preventDefault();
    if (!nuevoVideo.url.includes('youtube.com') && !nuevoVideo.url.includes('youtu.be')) {
      setMensaje("Por favor, ingresa una URL válida de YouTube");
      return;
    }

    setPublicando(true);
    setMensaje("");

    try {
      const response = await api.post("/videos/publicar", {
        id_entrenador,
        categoria: nuevoVideo.categoria,
        url: nuevoVideo.url
      });

      if (response.data.exito) {
        setMensaje("¡Video publicado con éxito!");
        setNuevoVideo({ categoria: "", url: "" });
        const videosResponse = await api.get("/videos/todos");
        if (videosResponse.data.exito) {
          setVideos(videosResponse.data.datos);
        }
      } else {
        throw new Error(response.data.mensaje || "Error al publicar el video");
      }
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || "Error al publicar el video");
    } finally {
      setPublicando(false);
    }
  };

  const handleEliminar = async (id_video) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este video?")) return;
    
    try {
      const response = await api.delete("/videos/eliminar", {
        data: { id_video, id_entrenador }
      });

      if (response.data.exito) {
        setVideos(videos.filter(v => v.id_video !== id_video));
        setMensaje("Video eliminado exitosamente");
      } else {
        throw new Error(response.data.mensaje || "No se pudo eliminar el video");
      }
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || "Error al eliminar el video");
    }
  };

  if (loading) {
    return (
      <div className="content-container">
        <Breadcrumbs />
        <div className="loading-indicator">
          <div className="spinner"></div>
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
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <Breadcrumbs />
      <div className="page-header">
        <h2>Videos de Entrenamiento</h2>
        <p>Explora nuestra colección de videos de ejercicios por categoría</p>
      </div>

      {tipoUsuario === "entrenador" && (
        <form onSubmit={handlePublicar} className="publicar-video-form">
          <h3>Compartir nuevo video</h3>
          <div className="form-row">
            <select
              value={nuevoVideo.categoria}
              onChange={e => setNuevoVideo({ ...nuevoVideo, categoria: e.target.value })}
              required
            >
              <option value="">Selecciona categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="URL del video de YouTube"
              value={nuevoVideo.url}
              onChange={e => setNuevoVideo({ ...nuevoVideo, url: e.target.value })}
              required
              pattern="https?://.+"
            />
            <button 
              type="submit" 
              disabled={publicando}
              className={publicando ? 'btn-disabled' : ''}
            >
              {publicando ? "Publicando..." : "Compartir"}
            </button>
          </div>
          {mensaje && <div className="mensaje-publicar">{mensaje}</div>}
        </form>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Buscar videos por categoría..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

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
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="video-link"
                >
                  <div className="video-thumbnail">
                    {youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                        alt={`Video de ${video.categoria}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="video-placeholder">
                        <span>Video no disponible</span>
                      </div>
                    )}
                  </div>
                  <div className="video-info">
                    <h3>{video.categoria}</h3>
                    {entrenador && (
                      <div className="video-entrenador">
                        <img 
                          src={entrenador.foto || "/default-profile.jpg"} 
                          alt="Foto del entrenador"
                          className="entrenador-avatar"
                        />
                        <span>{entrenador.nombre}</span>
                      </div>
                    )}
                  </div>
                </a>
                {esPropio && (
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleEliminar(video.id_video)}
                    aria-label="Eliminar video"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No se encontraron videos que coincidan con "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")}>
              Ver todos los videos
            </button>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Videos;