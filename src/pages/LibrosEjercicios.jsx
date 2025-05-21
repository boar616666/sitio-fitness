// src/pages/LibrosEjercicios.jsx
import React from "react";
import { Link } from "react-router-dom";
import LibroCard from "../components/LibroCard";
import "../styles/global.css";

const LibrosEjercicios = () => {
  const libros = [
    {
      id: 1,
      titulo: "Rutinas de Cardio",
      descripcion: "Descubre las mejores rutinas de cardio para quemar grasa y mejorar tu resistencia.",
      archivo: "/Libros/libro1.pdf",
    },
    {
      id: 2,
      titulo: "Entrenamiento con Pesas",
      descripcion: "Aprende a realizar ejercicios con pesas para ganar fuerza y masa muscular.",
      archivo: "/Libros/libro2.pdf",
    },
    {
      id: 3,
      titulo: "Entrenamiento de Fuerza, Estiramientos y Movilidad",
      descripcion: "Una guía completa sobre ejercicios de fuerza, técnicas de estiramiento y movilidad articular.",
      archivo: "https://www.sobrarbe.com/descargas/entrenamiento_fuerza_estiramientos_y_movilidad.pdf",
    },
  ];

  const handlePdfClick = (archivo) => {
    window.open(archivo, '_blank');
  };

  return (
    <div className="libros-page-container">
      <div className="libros-box">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">&gt;</span>
          <Link to="/blog">Blog</Link>
          <span className="separator">&gt;</span>
          <span>Libros de Ejercicios</span>
        </div>

        <h1>Libros de Ejercicios</h1>

        <div className="libros-list-horizontal">
          {libros.map((libro) => (
            <LibroCard 
              key={libro.id} 
              libro={libro} 
              onPdfClick={handlePdfClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibrosEjercicios;
