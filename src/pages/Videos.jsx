import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";
import ScrollToTop from "../components/ScrollToTop";

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
  const [entrenadores, setEntrenadores] = useState({}); // id_entrenador -> datos
  // Obtiene el id_entrenador autenticado desde sessionStorage
  const id_entrenador = sessionStorage.getItem("idEntrenador") || 9; // 9 como fallback
  const tipoUsuario = sessionStorage.getItem("tipoUsuario"); // "entrenador" o "cliente"
  const rolCliente = sessionStorage.getItem("rolCliente"); // puede ser "admin" si es cliente admin

  const categorias = [
    "Pecho",
    "Espalda",
    "Piernas",
    "Abdomen",
    "Full Body",
    "Cardio",
    "Brazos",
    "Glúteos",
    "HIIT",
    "Estiramiento"
  ];

  const navigate = useNavigate();

  // Cargar todos los videos al montar
  useEffect(() => {
    fetch("http://localhost:3000/videos/todos")
      .then(res => res.json())
      .then(async data => {
        if (data.exito) {
          setVideos(data.datos);
          // Obtener ids únicos de entrenadores
          const ids = [...new Set(data.datos.map(v => v.id_entrenador))];
          // Obtener datos de entrenadores en paralelo
          const entrenadoresData = {};
          await Promise.all(
            ids.map(async (id) => {
              try {
                const res = await fetch(`http://localhost:3000/entrenadores/${id}`);
                const json = await res.json();
                if (json.exito) {
                  entrenadoresData[id] = json.datos;
                }
              } catch {}
            })
          );
          setEntrenadores(entrenadoresData);
        }
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrado por título o categoría (no hay título en la API, así que solo por categoría)
  const filteredVideos = videos.filter((video) =>
    (video.categoria || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.url || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchQuery && filteredVideos.length === 0) {
      navigate("/error");
    }
  }, [searchQuery, filteredVideos, navigate]);

  // Publicar un nuevo video
  const handlePublicar = async (e) => {
    e.preventDefault();
    setPublicando(true);
    setMensaje("");
    const body = {
      id_entrenador,
      categoria: nuevoVideo.categoria,
      url: nuevoVideo.url
    };
    const res = await fetch("http://localhost:3000/videos/publicar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.exito) {
      setMensaje("¡Video publicado!");
      setNuevoVideo({ categoria: "", url: "" });
      // Recargar videos
      fetch("http://localhost:3000/videos/todos")
        .then(res => res.json())
        .then(data => {
          if (data.exito) setVideos(data.datos);
        });
    } else {
      setMensaje("Error al publicar");
    }
    setPublicando(false);
  };

  // Eliminar video propio
  const handleEliminar = async (id_video) => {
    if (!window.confirm("¿Seguro que deseas eliminar este video?")) return;
    try {
      const res = await fetch("http://localhost:3000/videos/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_video,
          id_entrenador: id_entrenador
        })
      });
      const data = await res.json();
      if (data.exito) {
        setVideos((prev) => prev.filter((v) => v.id_video !== id_video));
      } else {
        alert("No se pudo eliminar el video.");
      }
    } catch {
      alert("Error al eliminar el video.");
    }
  };

  return (
    <div className="content-container">
      <Breadcrumbs />
      <h2>Videos de Entrenamiento</h2>

      {/* Formulario para publicar video SOLO para entrenadores */}
      {tipoUsuario === "entrenador" && (
        <form onSubmit={handlePublicar} className="publicar-video-form" style={{marginBottom: 24, background: "#fafafa", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"}}>
          <h3 style={{color: "var(--primary-color)", marginBottom: 12}}>Publicar nuevo video</h3>
          <div style={{display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12}}>
            <select
              value={nuevoVideo.categoria}
              onChange={e => setNuevoVideo({ ...nuevoVideo, categoria: e.target.value })}
              required
              className="video-input"
              style={{flex: 1, minWidth: 120, padding: 8, borderRadius: 4, border: "1px solid #ccc"}}
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
              className="video-input"
              style={{flex: 2, minWidth: 180, padding: 8, borderRadius: 4, border: "1px solid #ccc"}}
            />
            <button type="submit" disabled={publicando} className="button" style={{minWidth: 100}}>
              {publicando ? "Publicando..." : "Publicar"}
            </button>
          </div>
          {mensaje && <div className="mensaje-publicar" style={{color: "var(--primary-color)", fontWeight: 500, marginTop: 8}}>{mensaje}</div>}
        </form>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar videos por categoría o URL..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="videos-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => {
            const youtubeId = getYoutubeId(video.url);
            const entrenador = entrenadores[video.id_entrenador];
            // Solo muestra el botón si es entrenador y el video es suyo
            // o si es cliente admin
            const esPropio =
              (tipoUsuario === "entrenador" && String(video.id_entrenador) === String(id_entrenador)) ||
              (tipoUsuario === "cliente" && rolCliente === "admin");
            return (
              <div key={video.id_video || video.id} className="video-card">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-link"
                >
                  <div className="video-thumbnail" style={{position: "relative"}}>
                    {youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                        alt={video.categoria}
                        style={{width: "100%", borderRadius: 8}}
                      />
                    ) : (
                      <div style={{ width: "320px", height: "180px", background: "#ccc", borderRadius: 8 }} />
                    )}
                  </div>
                  <div className="video-info" style={{padding: 12}}>
                    <h3 className="video-title" style={{fontSize: 16, margin: 0, color: "var(--primary-color)"}}>{video.categoria}</h3>
                    <div className="video-meta">
                      <span className="video-category">{video.categoria}</span>
                    </div>
                    {entrenador && (
                      <div className="video-entrenador" style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}>
                        <img
                          src={entrenador.foto}
                          alt={entrenador.nombre}
                          style={{width: 32, height: 32, borderRadius: "50%", objectFit: "cover"}}
                        />
                        <span style={{fontSize: 14, color: "#333"}}>{entrenador.nombre}</span>
                      </div>
                    )}
                  </div>
                </a>
                {esPropio && (
                  <button
                    className="button"
                    style={{margin: 12, background: "#e74c3c"}}
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
            <button onClick={() => setSearchQuery("")} className="clear-search">
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