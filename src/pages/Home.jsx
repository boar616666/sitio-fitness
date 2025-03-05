import "../styles/global.css";
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección

function Home() {
  const navigate = useNavigate(); // Hook para la navegación

  // Funciones para manejar los clics en las imágenes
  const handleImage1Click = () => {
    navigate('/blog'); // Redirige a la página de blog
  };

  const handleImage2Click = () => {
    navigate('/gimnasios'); // Redirige a la página de gimnasios
  };

  const handleImage3Click = () => {
    navigate('/videos'); // Redirige a la página de videos
  };

  return (
    <div className="home">
      {/* Contenido Principal */}
      <div className="hero">
        <h1>Bienvenido a FitnessPro</h1>
        <p>Encuentra los mejores consejos y videos para mejorar tu salud.</p>
        
      </div>

      {/* Sección de Imágenes y Textos */}
      <div className="image-text-section">
        {/* Primera Imagen y Texto */}
        <div className="image-text-item" onClick={handleImage1Click}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSlzYqAeNgImGX8wcx3xZOwbcUbRZ-9HET9A&s" alt="Ejercicio 1" />
          <p className="image-text">💪 Encuentra todo lo que necesitas para estar en forma 💪<br />
          Descubre información sobre ejercicios efectivos para mantenerte saludable y alcanzar tus metas fitness.</p>
        </div>

        {/* Segunda Imagen y Texto */}
        <div className="image-text-item" onClick={handleImage2Click}>
          <img src="https://cdn0.uncomo.com/es/posts/1/0/4/beneficios_del_fitness_52401_1_600.jpg" alt="Ejercicio 2" />
          <p className="image-text">🏋️‍♂️ Conoce los mejores gimnasios de la ciudad 🏋️‍♀️<br />
          Te ayudamos a encontrar el lugar ideal para entrenar y mejorar tu rendimiento.</p>
        </div>

        {/* Tercera Imagen y Texto */}
        <div className="image-text-item" onClick={handleImage3Click}>
          <img src="https://masaireweb.com/wp-content/uploads/2019/02/fitness-01-gq-10sep18_b-1.jpg" alt="Ejercicio 3" />
          <p className="image-text">🎥 Aprende con videos y demostraciones 🎥<br />
          Mira tutoriales prácticos para realizar los ejercicios correctamente y optimizar tus resultados.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;