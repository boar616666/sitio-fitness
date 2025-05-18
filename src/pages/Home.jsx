import "../styles/global.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // Carrusel de imágenes y textos
  const slides = [
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSlzYqAeNgImGX8wcx3xZOwbcUbRZ-9HET9A&s",
      text: "💪 Encuentra todo lo que necesitas para estar en forma 💪\nDescubre información sobre ejercicios efectivos para mantenerte saludable y alcanzar tus metas fitness.",
      route: "/blog",
    },
    {
      img: "https://cdn0.uncomo.com/es/posts/1/0/4/beneficios_del_fitness_52401_1_600.jpg",
      text: "🏋️‍♂️ Conoce los mejores gimnasios de la ciudad 🏋️‍♀️\nTe ayudamos a encontrar el lugar ideal para entrenar y mejorar tu rendimiento.",
      route: "/gimnasios",
    },
    {
      img: "https://masaireweb.com/wp-content/uploads/2019/02/fitness-01-gq-10sep18_b-1.jpg",
      text: "🎥 Aprende con videos y demostraciones 🎥\nMira tutoriales prácticos para realizar los ejercicios correctamente y optimizar tus resultados.",
      route: "/videos",
    },
  ];

  const isLoggedIn = !!sessionStorage.getItem("tipoUsuario");

  const handleSlideClick = (route) => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      return;
    }
    navigate(route);
  };

  const prevSlide = () =>
    setCurrent((current - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((current + 1) % slides.length);

  return (
    <div className="home">
      <div className="hero">
        <h1>Bienvenido a FitnessPro</h1>
        <p>Encuentra los mejores consejos y videos para mejorar tu salud.</p>
      </div>

      {/* Carrusel */}
      <div
        className="carousel-container"
        style={{ position: "relative", maxWidth: 600, margin: "2rem auto" }}
      >
        <div
          className="carousel-slide"
          style={{
            cursor: "pointer",
            textAlign: "center",
            background: "rgba(255,255,255,0.95)",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            padding: 32,
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => handleSlideClick(slides[current].route)}
        >
          <img
            src={slides[current].img}
            alt={`slide-${current}`}
            style={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
          />
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#800020",
              marginBottom: 12,
              whiteSpace: "pre-line",
            }}
          >
            {slides[current].text}
          </div>
          <div style={{ fontSize: 16, color: "#555" }}>
            {isLoggedIn
              ? "Haz clic para continuar"
              : "Inicia sesión para acceder"}
          </div>
        </div>
        {/* Controles del carrusel */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#800020",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: 22,
            cursor: "pointer",
            zIndex: 2,
          }}
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#800020",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: 22,
            cursor: "pointer",
            zIndex: 2,
          }}
          aria-label="Siguiente"
        >
          ›
        </button>
        {/* Indicadores */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          {slides.map((_, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: idx === current ? "#800020" : "#ccc",
                margin: "0 4px",
                cursor: "pointer",
              }}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}

export default Home;
