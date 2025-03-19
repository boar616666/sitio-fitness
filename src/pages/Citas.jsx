import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";

const instructores = [
  {
    id: 1,
    nombre: "Juan Pérez",
    imagen: "ruta/a/la/imagen1.jpg",
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    imagen: "ruta/a/la/imagen2.jpg",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    imagen: "ruta/a/la/imagen3.jpg",
  },
];

function Citas() {
  const navigate = useNavigate();

  const handleSeleccionarInstructor = (id) => {
    navigate(`/citas/instructor/${id}`);
  };

  return (
    <div className="content-container">
      <Breadcrumbs />
      <h2>Agendar Cita</h2>
      <p>Selecciona un instructor para ver más detalles.</p>

      {/* Lista de instructores */}
      <div className="instructores-list-horizontal">
        {instructores.map((instructor) => (
          <div
            key={instructor.id}
            className="instructor-card"
            onClick={() => handleSeleccionarInstructor(instructor.id)}
          >
            <img
              src={instructor.imagen}
              alt={instructor.nombre}
              className="instructor-image"
            />
            <h2>{instructor.nombre}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Citas;