// src/pages/Blog.jsx
import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
const Blog = () => {
  return (
    <div className="blog-container">
      <div className="blog-box">
        <h1>Blog de Fitness</h1>
        <Breadcrumbs />
        <p className="blog-description">
          En nuestro blog encontrarás consejos, rutinas y recomendaciones para mantenerte en forma. 
          Además, hemos preparado una colección de libros PDF con ejercicios para que puedas entrenar 
          desde casa o en el gimnasio. ¡Descárgalos y comienza tu rutina hoy mismo!
        </p>
        <Link to="/libros-ejercicios" className="blog-button">
          Ver Libros de Ejercicios
        </Link>
      </div>
    </div>
  );
};

export default Blog;