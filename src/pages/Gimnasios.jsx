import React from "react";
import { gimnasios } from "../data/gimnasios";
import GimnasioCard from "../components/GimnasioCard";
import Breadcrumbs from "../components/Breadcrumbs";

const Gimnasios = () => {
  // Verificación de datos
  if (!gimnasios || gimnasios.length === 0) {
    return (
      <div className="gimnasios-page">
        <p>No hay gimnasios disponibles</p>
      </div>
    );
  }

  return (
    <div className="gimnasios-page">
      <Breadcrumbs />
      <h1 style={{color: '#800020'}}>Gimnasios Recomendados</h1>
      <p style={{color: '#333'}}>Encuentra los mejores gimnasios cerca de ti.</p>
      
      <div className="gimnasios-grid">
        {gimnasios.map((gimnasio) => (
          <GimnasioCard 
            key={gimnasio.id} 
            gimnasio={gimnasio} 
          />
        ))}
      </div>
    </div>
  );
};

export default Gimnasios;