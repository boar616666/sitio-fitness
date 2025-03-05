import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Citas from "./pages/Citas";
import Login from "./pages/Login";
import Header from "./components/Header"; // Asegúrate de que el nombre del archivo sea correcto (Header.js)
import Footer from "./components/Footer"; // Asegúrate de que el nombre del archivo sea correcto (Footer.js)
import Videos from "./pages/Videos";
import ErrorPage from "./pages/ErrorPage"; // Asegúrate de que el nombre del archivo sea correcto (ErrorPage.js)
import Gimnasios from "./pages/Gimnasios"; // Importa el componente Gimnasios

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/gimnasios" element={<Gimnasios />} /> {/* Ruta para Gimnasios */}
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;