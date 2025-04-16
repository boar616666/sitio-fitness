import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos] = useState([
    { 
      id: 1, 
      title: "Rutina de Pecho - 10 Minutos", 
      url: "https://youtu.be/Uh976n5NB_Q?si=8r_DEIAPP-s0GmWG",
      thumbnail: "https://img.youtube.com/vi/Uh976n5NB_Q/mqdefault.jpg",
      category: "Pecho",
      duration: "10 min"
    },
    { 
      id: 2, 
      title: "Ejercicios de Espalda - Full Workout", 
      url: "https://youtu.be/X1Lzg7T3aA8?si=LhbKSy_hhLC0pntW",
      thumbnail: "https://img.youtube.com/vi/X1Lzg7T3aA8/mqdefault.jpg",
      category: "Espalda",
      duration: "15 min"
    },
    { 
      id: 3, 
      title: "Piernas Intenso - Sin Equipo", 
      url: "https://youtu.be/DkVcYmhfucE?si=jwddgp_bdCkwKxzE",
      thumbnail: "https://img.youtube.com/vi/DkVcYmhfucE/mqdefault.jpg",
      category: "Piernas",
      duration: "12 min"
    },
    { 
      id: 4, 
      title: "Abdomen Definido - Nivel Intermedio", 
      url: "https://youtu.be/example1",
      thumbnail: "https://img.youtube.com/vi/example1/mqdefault.jpg",
      category: "Abdomen",
      duration: "8 min"
    },
    { 
      id: 5, 
      title: "Full Body - Rutina Completa", 
      url: "https://youtu.be/example2",
      thumbnail: "https://img.youtube.com/vi/example2/mqdefault.jpg",
      category: "Full Body",
      duration: "20 min"
    }
  ]);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchQuery && filteredVideos.length === 0) {
      navigate("/error");
    }
  }, [searchQuery, filteredVideos, navigate]);

  return (
    <div className="content-container">
      <Breadcrumbs />
      <h2>Videos de Entrenamiento</h2>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar videos por título o categoría..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="videos-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <a 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-link"
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <div className="video-meta">
                    <span className="video-category">{video.category}</span>
                  </div>
                </div>
              </a>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron videos con "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="clear-search">
              Mostrar todos los videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;