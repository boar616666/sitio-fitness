import React from 'react';
import "../styles/global.css";

function Gimnasios() {
  // Datos de ejemplo para los gimnasios
  const gimnasios = [
    {
      id: 1,
      nombre: "Gimnasio PowerFit",
      direccion: "Calle Fitness 123, Ciudad Deportiva",
      imagen: "https://via.placeholder.com/400x200",
    },
    {
      id: 2,
      nombre: "Gimnasio IronGym",
      direccion: "Avenida Salud 456, Zona Activa",
      imagen: "https://via.placeholder.com/400x200",
    },
    {
      id: 3,
      nombre: "Gimnasio FlexZone",
      direccion: "Boulevard Ejercicio 789, Distrito Fitness",
      imagen: "https://via.placeholder.com/400x200",
    },
  ];

  return (
    <div className="gimnasios-container">
      <h1>Gimnasios Recomendados</h1>
      <p>Encuentra los mejores gimnasios cerca de ti.</p>

      {/* Lista de gimnasios */}
      <div className="gimnasios-list">
        {gimnasios.map((gimnasio) => (
          <div key={gimnasio.id} className="gimnasio-card">
            <img src={gimnasio.imagen} alt={gimnasio.nombre} className="gimnasio-image" />
            <div className="gimnasio-info">
              <h2>{gimnasio.nombre}</h2>
              <p>{gimnasio.direccion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gimnasios;