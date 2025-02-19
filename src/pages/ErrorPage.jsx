import React from "react";
import Breadcrumbs from "../components/Breadcrumbs"; // ✅ Importar Breadcrumbs
import "../styles/global.css";

const ErrorPage = () => {
  return (
    <div className="content-container">
      <Breadcrumbs /> {/* ✅ Mostrar migas de pan */}
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, no se encontraron videos con esa búsqueda.</p>
      <a href="/videos" className="go-back">
        Volver a Videos
      </a>
    </div>
  );
};

export default ErrorPage;
