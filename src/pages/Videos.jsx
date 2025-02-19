import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Reemplaza useHistory por useNavigate
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";

const Videos = () => {
  // Estado para el texto de búsqueda y los videos
  const [searchQuery, setSearchQuery] = useState("");
  const [videos] = useState([
    { id: 1, title: "Ejercicio para abdomen" },
    { id: 2, title: "Rutina de pesas" },
    { id: 3, title: "Cardio en casa" }
  ]);

  const navigate = useNavigate(); // ✅ Usar useNavigate

  // Función para manejar el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar videos por el texto de búsqueda
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Evitar redirigir en cada render (se usa useEffect)
  useEffect(() => {
    if (searchQuery && filteredVideos.length === 0) {
      navigate("/error"); // ✅ Redirige solo si no hay resultados
    }
  }, [searchQuery, filteredVideos, navigate]);

  return (
    <div className="content-container">
      <Breadcrumbs />
      <h2>Videos</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar videos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="videos-list">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-item">
              <h3>{video.title}</h3>
            </div>
          ))
        ) : (
          <p>No se encontraron videos.</p>
        )}
      </div>
    </div>
  );
};

export default Videos;
