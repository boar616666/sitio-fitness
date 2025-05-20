import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [gimnasio, setGimnasio] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL; // Obtenemos la URL base del .env

  // Obtener el nombre del gimnasio si estamos en la página de detalle
  useEffect(() => {
    const fetchGimnasioName = async () => {
      // Verificar si estamos en una ruta de gimnasio
      if (pathnames.includes("gimnasios") && pathnames.length > 1) {
        try {
          const gymId = pathnames[pathnames.indexOf("gimnasios") + 1];
          
          if (!isNaN(gymId)) {
            const response = await axios.get(`${API_URL}/api/gimnasios/listar`);
            
            if (response.data.exito) {
              const gimnasioEncontrado = response.data.datos.find(
                (g) => g.id_gimnasio === parseInt(gymId)
              );
              
              if (gimnasioEncontrado) {
                setGimnasio(gimnasioEncontrado);
              }
            }
          }
        } catch (error) {
          console.error("Error al cargar nombre del gimnasio:", error);
        }
      }
    };

    fetchGimnasioName();
  }, [pathnames, API_URL]);

  return (
    <nav className="breadcrumbs">
      <Link to="/">Inicio</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        // Si es un ID de gimnasio, mostrar el nombre del gimnasio en su lugar
        if (value === params.id && gimnasio && pathnames[index - 1] === "gimnasios") {
          label = gimnasio.nombre;
        }

        // Si la parte de la ruta es "instructor", no crear un enlace
        if (value === "instructor") {
          return (
            <span key={to}>
              {" > "}
              <span>{label}</span>
            </span>
          );
        }

        // Para otras partes de la ruta, crear un enlace (excepto la última)
        return (
          <span key={to}>
            {" > "}
            {index === pathnames.length - 1 ? (
              <span>{label}</span>
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;