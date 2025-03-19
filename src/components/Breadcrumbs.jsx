import { Link, useLocation } from "react-router-dom";
import "../styles/global.css";

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumbs">
      <Link to="/">Inicio</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        // Si la parte de la ruta es "instructor", no crear un enlace
        if (value === "instructor") {
          return (
            <span key={to}>
              {" > "}
              <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
            </span>
          );
        }

        // Para otras partes de la ruta, crear un enlace
        return (
          <span key={to}>
            {" > "}
            <Link to={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;