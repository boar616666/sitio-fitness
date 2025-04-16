import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gimnasios } from "../data/gimnasios";
import Breadcrumbs from "../components/Breadcrumbs";
import StarRating from "../components/StarRating";
import ReCAPTCHA from "react-google-recaptcha";

const GimnasioDetalle = () => {
  const { id } = useParams();
  const [gimnasio, setGimnasio] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rating, setRating] = useState(0);
  const [captcha, setCaptcha] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Coordenadas del gimnasio (extraídas del enlace de Google Maps proporcionado)
  const gymLocation = {
    lat: 25.6789, // Reemplaza con la latitud real
    lng: -100.3090 // Reemplaza con la longitud real
  };

  useEffect(() => {
    // Buscar el gimnasio
    const foundGym = gimnasios.find((g) => g.id === parseInt(id));
    setGimnasio(foundGym || null);
    
    // Verificar autenticación
    setIsLoggedIn(!!localStorage.getItem("token"));
    
    // Configurar ubicación por defecto del gimnasio si no existe
    if (foundGym && !foundGym.ubicacion) {
      setGimnasio(prev => ({
        ...prev,
        ubicacion: "https://maps.app.goo.gl/urc44edpy37fPBFK8"
      }));
    }
  }, [id]);

  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          calculateDistance(position.coords);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setMessage("No pudimos obtener tu ubicación");
          setLoadingLocation(false);
        }
      );
    } else {
      setMessage("Geolocalización no soportada por tu navegador");
      setLoadingLocation(false);
    }
  };

  const calculateDistance = (userCoords) => {
    // Fórmula Haversine para calcular distancia entre dos coordenadas
    const R = 6371; // Radio de la Tierra en km
    const dLat = (gymLocation.lat - userCoords.latitude) * Math.PI / 180;
    const dLon = (gymLocation.lng - userCoords.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userCoords.latitude * Math.PI / 180) * 
      Math.cos(gymLocation.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    setDistance(distance.toFixed(1)); // 1 decimal
  };

  const openWhatsApp = () => {
    const phone = gimnasio?.telefono || "4181571316";
    const message = encodeURIComponent("Estoy interesado en agendar una cita en su gimnasio");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleRateChange = (newRating) => {
    setRating(newRating);
    setMessage("");
  };

  const submitRating = async () => {
    if (!isLoggedIn) {
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

    setIsSubmitting(true);
    setMessage("Enviando calificación...");

    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("¡Gracias por tu calificación!");
      setRating(0);
      setCaptcha(null);
    } catch (error) {
      setMessage("Error al enviar la calificación. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!gimnasio) {
    return <div className="error-message">Gimnasio no encontrado</div>;
  }

  return (
    <div className="gimnasio-detalle-container">
      <div className="gimnasio-detalle-box">
        <Breadcrumbs />
        <h1>{gimnasio.nombre}</h1>
        
        {/* Sección de información */}
        <div className="gimnasio-info-section">
          <p><strong>Dirección:</strong> {gimnasio.direccion}</p>
          
          {/* Mapa y ubicación */}
          <div className="location-section">
            <h3>Ubicación</h3>
            <div className="map-container">
              <iframe
                title="Ubicación del gimnasio"
                src={`https://www.google.com/maps/embed?pb=${gimnasio.ubicacion?.split('gl/')[1] || ''}`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="distance-info">
              {!userLocation ? (
                <button 
                  onClick={getUserLocation} 
                  disabled={loadingLocation}
                  className="location-button"
                >
                  {loadingLocation ? 'Calculando...' : '¿Qué tan lejos estoy?'}
                </button>
              ) : (
                <p>
                  Estás a aproximadamente {distance} km del gimnasio
                </p>
              )}
            </div>
          </div>
          
          <p><strong>Horarios:</strong> {gimnasio.horarios}</p>
          <p><strong>Teléfono:</strong> {gimnasio.telefono}</p>
          
          {gimnasio.descripcion && (
            <div className="gimnasio-descripcion">
              <strong>Descripción:</strong>
              <p>{gimnasio.descripcion}</p>
            </div>
          )}
          
          {gimnasio.servicios && gimnasio.servicios.length > 0 && (
            <>
              <h3>Servicios:</h3>
              <ul className="servicios-list">
                {gimnasio.servicios.map((servicio, index) => (
                  <li key={index}>{servicio}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        {/* Sección de fotos */}
        {gimnasio.fotos && gimnasio.fotos.length > 0 && (
          <>
            <h3>Fotos:</h3>
            <div className="gimnasio-fotos">
              {gimnasio.fotos.map((foto, index) => (
                <img key={index} src={foto} alt={`Foto ${index + 1}`} />
              ))}
            </div>
          </>
        )}
        
        {/* Sección de rating */}
        <div className="rating-section">
          <h3>Calificación</h3>
          <div className="average-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(gimnasio.promedioCalificacion) ? "filled" : "empty"}>
                  ★
                </span>
              ))}
            </span>
            <span className="rating-value">
              {gimnasio.promedioCalificacion} ({gimnasio.totalCalificaciones} calificaciones)
            </span>
          </div>
          
          {isLoggedIn ? (
            <div className="rating-form">
              <h4>Califica este gimnasio</h4>
              <StarRating 
                initialRating={rating}
                onRate={handleRateChange}
              />
              
              <div className="captcha-container">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={(value) => setCaptcha(value)}
                />
              </div>
              
              <button 
                onClick={submitRating}
                disabled={isSubmitting || !rating || !captcha}
                className="submit-rating-btn"
              >
                {isSubmitting ? "Enviando..." : "Enviar Calificación"}
              </button>
              
              {message && <p className="rating-message">{message}</p>}
            </div>
          ) : (
            <p className="login-message">
              <a href="/login">Inicia sesión</a> para calificar este gimnasio
            </p>
          )}
        </div>
        
        {/* Botón de WhatsApp al final */}
        <div className="whatsapp-section">
          <button 
            onClick={openWhatsApp} 
            className="whatsapp-button"
          >
            Agendar cita via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default GimnasioDetalle;