// src/pages/LibrosEjercicios.jsx
import React from "react";
import { Link } from "react-router-dom";
import LibroCard from "../components/LibroCard";
import Breadcrumbs from "../components/Breadcrumbs";
const LibrosEjercicios = () => {
  const libros = [
    {
      id: 1,
      titulo: "Rutinas de Cardio",
      descripcion: "Descubre las mejores rutinas de cardio para quemar grasa y mejorar tu resistencia.",
      archivo: "/libros/02. Conceptos y métodos para el entrenamiento físico Autor Manuel Vinuesa Lope e Ignacio Vinuesa Jiménez", // Ruta en la carpeta public
    },
    {
      id: 2,
      titulo: "Entrenamiento con Pesas",
      descripcion: "Aprende a realizar ejercicios con pesas para ganar fuerza y masa muscular.",
      archivo: "/libros/libro2.pdf", // Ruta en la carpeta public
    }
  ];

  return (
    <div className="libros-page-container">
      <div className="libros-box">
      <Breadcrumbs />
          <Link to="/">Inicio</Link> &gt; <span>Libros de Ejercicios</span>
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
    
  );
};

export default LibrosEjercicios;