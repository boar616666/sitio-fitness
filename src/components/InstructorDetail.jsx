import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/global.css";
import Breadcrumbs from "../components/Breadcrumbs";
import ReCAPTCHA from "react-google-recaptcha";

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
    promedioCalificacion: 4.2,
    totalCalificaciones: 15
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
    promedioCalificacion: 4.7,
    totalCalificaciones: 23
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
    promedioCalificacion: 3.9,
    totalCalificaciones: 8
  },
];

function InstructorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [captcha, setCaptcha] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

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

  // Verificar si el usuario está autenticado (simulado)
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    return !!token;
  };

  const handleSubmitRating = async () => {
    if (!checkAuth()) {
      setMessage("Debes iniciar sesión para calificar");
      return;
    }

    if (!captcha) {
      setMessage("Por favor completa el CAPTCHA");
      return;
    }

    if (rating === 0) {
      setMessage("Por favor selecciona una calificación");
      return;
    }

    // Aquí iría la llamada real a tu API
    try {
      // Simulación de envío a la API
      setMessage("¡Gracias por tu calificación de " + rating + " estrellas!");
      // Limpiar después de enviar
      setRating(0);
      setCaptcha(null);
      // Aquí normalmente actualizarías el promedio del instructor
    } catch (error) {
      setMessage("Error al enviar la calificación");
    }
  };

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

        {/* Sección de Calificación */}
        <div className="rating-section">
          <h3>Calificación del Instructor</h3>
          <div className="average-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(instructor.promedioCalificacion) ? "filled" : "empty"}>
                  ★
                </span>
              ))}
            </span>
            <span className="rating-value">
              {instructor.promedioCalificacion} ({instructor.totalCalificaciones} calificaciones)
            </span>
          </div>

          <div className="rating-form">
            <h4>Califica a este instructor</h4>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= (hover || rating) ? "on" : "off"}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">★</span>
                </button>
              ))}
            </div>

            {isLoggedIn ? (
              <>
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={(value) => setCaptcha(value)}
                />
                <button 
                  onClick={handleSubmitRating}
                  className="submit-rating-btn"
                  disabled={!rating}
                >
                  Enviar Calificación
                </button>
              </>
            ) : (
              <p className="login-message">
                <a href="/login">Inicia sesión</a> para calificar instructores
              </p>
            )}

            {message && <p className="rating-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDetail;