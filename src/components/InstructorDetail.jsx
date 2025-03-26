import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/global.css";
import Breadcrumbs from "../components/Breadcrumbs";

const instructores = [
  {
    id: 1,
    nombre: "Juan Pérez",
    imagen: "https://img.freepik.com/foto-gratis/entrenador-personal-fitness-haciendo-ejercicio_23-2148989171.jpg",
    edad: 30,
    gimnasio: "Gimnasio XYZ",
    costoPorSesion: "$50",
    costoMensual: "$200",
    telefono: "+123 456 7890",
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    imagen: "https://img.freepik.com/foto-gratis/mujer-fitness-sosteniendo-pesa-alegre_23-2148283182.jpg",
    edad: 28,
    gimnasio: "Gimnasio ABC",
    costoPorSesion: "$60",
    costoMensual: "$250",
    telefono: "+987 654 3210",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    imagen: "https://www.efdeportes.com/efd187/el-arte-de-competir-en-el-fisicoculturismo-03.jpg",
    edad: 35,
    gimnasio: "Gimnasio DEF",
    costoPorSesion: "$55",
    costoMensual: "$220",
    telefono: "+555 123 4567",
  },
];

function InstructorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const instructor = instructores.find((inst) => inst.id === parseInt(id));

  if (!instructor) {
    return <div>Instructor no encontrado</div>;
  }

  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Citas", link: "/citas" },
    { name: "Instructor", link: null },
    { name: instructor.nombre, link: null },
  ];

  return (
    <div className="instructor-detalle-container">
      <div className="instructor-detalle-box">
        <Breadcrumbs paths={breadcrumbPaths} />

        <h1>{instructor.nombre}</h1>
        <img
          src={instructor.imagen}
          alt={`Foto de ${instructor.nombre}`}
          className="instructor-detalle-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
          }}
        />
        <p>Edad: {instructor.edad} años</p>
        <p>Gimnasio: {instructor.gimnasio}</p>
        <p>Costo por sesión: {instructor.costoPorSesion}</p>
        <p>Costo mensual: {instructor.costoMensual}</p>
        <p>Teléfono: {instructor.telefono}</p>

        
      </div>
    </div>
  );
}

export default InstructorDetail;