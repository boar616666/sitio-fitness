import React, { useState, useEffect } from "react";
import axios from "axios";
import GimnasioCard from "../components/GimnasioCard";
import Breadcrumbs from "../components/Breadcrumbs";
import RegisterCallToAction from "../components/RegisterCallToAction";

const Gimnasios = () => {
  const [gimnasios, setGimnasios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGimnasios = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/gimnasios/listar");
        if (response.data.exito) {
          setGimnasios(response.data.datos);
        } else {
          setError("No se pudieron cargar los gimnasios");
        }
      } catch (error) {
        console.error("Error al cargar gimnasios:", error);
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchGimnasios();
  }, []);

  if (loading) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <div className="loading-indicator">
          <p>Cargando gimnasios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Verificación de datos
  if (!gimnasios || gimnasios.length === 0) {
    return (
      <div className="gimnasios-container">
        <Breadcrumbs />
        <p>No hay gimnasios disponibles</p>
      </div>
    );
  }

  return (
    <div className="gimnasios-container">
      <Breadcrumbs />
      <h1>Gimnasios Recomendados</h1>
      <p className="gimnasios-description">Encuentra los mejores gimnasios cerca de ti.</p>
      
      <div className="gimnasios-list">
        {gimnasios.map((gimnasio) => (
          <GimnasioCard 
            key={gimnasio.id_gimnasio} 
            gimnasio={gimnasio} 
          />
        ))}
      </div>

      <div className="gimnasios-cta-section">
        <RegisterCallToAction 
          title="¿Eres entrenador?"
          description="Registra tu perfil como entrenador y conéctate con nuevos clientes en cualquiera de nuestros gimnasios asociados."
          buttonText="Regístrate como entrenador"
          type="entrenador"
        />
      </div>
    </div>
  );
};

export default Gimnasios;