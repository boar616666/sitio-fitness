import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // Para redirigir a la página de error
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";

const Videos = () => {
  // Estado para el texto de búsqueda y los videos
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([
    { id: 1, title: "Ejercicio para abdomen" },
    { id: 2, title: "Rutina de pesas" },
    { id: 3, title: "Cardio en casa" }
  ]);

  const history = useHistory();

  // Función para manejar el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar videos por el texto de búsqueda
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Si no hay resultados, redirigir a la página de error
  if (searchQuery && filteredVideos.length === 0) {
    history.push("/error"); // Redirige a la página de error
  }

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
