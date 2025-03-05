// src/pages/GimnasioDetalle.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { gimnasios } from "../data/gimnasios";
import Breadcrumbs from "../components/Breadcrumbs";

const GimnasioDetalle = () => {
  const { id } = useParams(); // Obtén el ID de la URL
  const gimnasio = gimnasios.find((g) => g.id === parseInt(id));

  if (!gimnasio) {
    return <div>Gimnasio no encontrado</div>;
  }

  return (
    <div className="gimnasio-detalle-container">
      <div className="gimnasio-detalle-box">
      <Breadcrumbs />
        <h1>{gimnasio.nombre}</h1>
        <p><strong>Dirección:</strong> {gimnasio.direccion}</p>
        <p><strong>Horarios:</strong> {gimnasio.horarios}</p>
        <p><strong>Descripción:</strong> {gimnasio.descripcion}</p>
        <h2>Servicios:</h2>
        <ul>
          {gimnasio.servicios.map((servicio, index) => (
            <li key={index}>{servicio}</li>
          ))}
        </ul>
        <h2>Fotos:</h2>
        <div className="gimnasio-fotos">
          {gimnasio.fotos.map((foto, index) => (
            <img key={index} src={foto} alt={`Foto ${index + 1}`} />
          ))}
        </div>
        <footer className="gimnasio-footer">
          © {new Date().getFullYear()} {gimnasio.nombre}. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default GimnasioDetalle;