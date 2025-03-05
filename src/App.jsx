import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Citas from "./pages/Citas";
import Login from "./pages/Login";
import Videos from "./pages/Videos";
import Gimnasios from "./pages/Gimnasios";
import ErrorPage from "./pages/ErrorPage";
import Header from "./components/header"; // Asegúrate de que el archivo sea Header.js o Header.jsx
import Footer from "./components/Footer"; // Asegúrate de que el archivo sea Footer.js o Footer.jsx
import GimnasioDetalle from "./pages/GimnasioDetalle";

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
          <Route path="/gimnasios" element={<Gimnasios />} />
        
          <Route path="*" element={<ErrorPage />} />
          <Route path="/gimnasios/:id" element={<GimnasioDetalle />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;