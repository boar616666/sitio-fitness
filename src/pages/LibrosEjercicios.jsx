// src/pages/LibrosEjercicios.jsx
import React from "react";
import { Link } from "react-router-dom";
import LibroCard from "../components/LibroCard";

const LibrosEjercicios = () => {
  const libros = [
    {
      id: 1,
      titulo: "Rutinas de Cardio",
      descripcion: "Descubre las mejores rutinas de cardio para quemar grasa y mejorar tu resistencia.",
      archivo: "/libros/libro1.pdf", // Ruta en la carpeta public
    },
    {
      id: 2,
      titulo: "Entrenamiento con Pesas",
      descripcion: "Aprende a realizar ejercicios con pesas para ganar fuerza y masa muscular.",
      archivo: "/libros/libro2.pdf", // Ruta en la carpeta public
    },
    {
      id: 3,
      titulo: "Yoga y Estiramientos",
      descripcion: "Mejora tu flexibilidad y relájate con estas rutinas de yoga y estiramientos.",
      archivo: "/libros/libro3.pdf", // Ruta en la carpeta public
    },
  ];

  return (
    <div className="libros-page-container">
      <div className="libros-box">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">&gt;</span>
          <Link to="/blog">Blog</Link>
          <span className="separator">&gt;</span>
          <span>Libros de Ejercicios</span>
        </div>

        {/* Título */}
        <h1>Libros de Ejercicios</h1>

        {/* Lista de libros en una línea horizontal */}
        <div className="libros-list-horizontal">
          {libros.map((libro) => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibrosEjercicios;