import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/global.css";
import Breadcrumbs from "../components/Breadcrumbs";

const instructores = [
  {
    id: 1,
    nombre: "Juan Pérez",
    imagen: "ruta/a/la/imagen1.jpg",
    edad: 30,
    gimnasio: "Gimnasio XYZ",
    costoPorSesion: "$50",
    costoMensual: "$200",
    telefono: "+123 456 7890",
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    imagen: "ruta/a/la/imagen2.jpg",
    edad: 28,
    gimnasio: "Gimnasio ABC",
    costoPorSesion: "$60",
    costoMensual: "$250",
    telefono: "+987 654 3210",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    imagen: "ruta/a/la/imagen3.jpg",
    edad: 35,
    gimnasio: "Gimnasio DEF",
    costoPorSesion: "$55",
    costoMensual: "$220",
    telefono: "+555 123 4567",
  },
];

function InstructorDetail() {
  const { id } = useParams(); // Obtiene el ID del instructor de la URL
  const navigate = useNavigate();

  // Busca el instructor en la lista
  const instructor = instructores.find((inst) => inst.id === parseInt(id));

  // Si no se encuentra el instructor, muestra un mensaje de error
  if (!instructor) {
    return <div>Instructor no encontrado</div>;
  }

  // Rutas para el Breadcrumbs
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Citas", link: "/citas" },
    { name: "Instructor", link: null }, // No hay enlace para la página actual
    { name: instructor.nombre, link: null }, // No hay enlace para la página actual
  ];

  return (
    <div className="instructor-detalle-container">
      <div className="instructor-detalle-box">
        {/* Breadcrumbs */}
        <Breadcrumbs paths={breadcrumbPaths} />

        <h1>{instructor.nombre}</h1>
        <img
          src={instructor.imagen}
          alt={instructor.nombre}
          className="instructor-detalle-image"
        />
        <p>Edad: {instructor.edad} años</p>
        <p>Gimnasio: {instructor.gimnasio}</p>
        <p>Costo por sesión: {instructor.costoPorSesion}</p>
        <p>Costo mensual: {instructor.costoMensual}</p>
        <p>Teléfono: {instructor.telefono}</p>

        {/* Botón para volver a la lista de instructores */}
        <button onClick={() => navigate("/citas")}>Volver a Instructores</button>
      </div>
    </div>
  );
}

export default InstructorDetail;