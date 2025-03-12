import React from "react";
import { gimnasios } from "../data/gimnasios";
import GimnasioCard from "../components/GimnasioCard";
import Breadcrumbs from "../components/Breadcrumbs";

const Gimnasios = () => {
  return (
    <div className="gimnasios-container">
      <Breadcrumbs />
      <h1>Gimnasios Recomendados</h1>
      <p>Encuentra los mejores gimnasios cerca de ti.</p>
      <div className="gimnasios-list">
        {gimnasios.map((gimnasio) => (
          <GimnasioCard key={gimnasio.id} gimnasio={gimnasio} />
        ))}
      </div>
    </div>
  );
};

export default Gimnasios;