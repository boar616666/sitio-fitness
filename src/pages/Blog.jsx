import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/global.css";

function Blog() {
  return (
    <div className="content-container">
      <Breadcrumbs />
      <h2>Artículos de Blog</h2>
      <p>Aquí encontrarás los mejores consejos sobre salud y fitness.</p>
    </div>
  );
}

export default Blog;
