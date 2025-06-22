import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { initSessionManager } from "./utils/sessionManager";
import Home from "./pages/Home";
import Blog from "./pages/Blog";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Videos from "./pages/Videos";
import Gimnasios from "./pages/Gimnasios";
import ErrorPage from "./pages/ErrorPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GimnasioDetalle from "./pages/GimnasioDetalle";
import LibrosEjercicios from "./pages/LibrosEjercicios";
import InstructorDetail from "./components/InstructorDetail";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import VerifyPending from "./pages/VerifyPending";
import Citas from "./pages/Citas";
import Profile from "./pages/Profile";
import MisCitas from "./pages/MisCitas";
import SolicitudesAdmin from "./pages/SolicitudesAdmin";
import RecuperarContraseña from "./pages/RecuperarContraseña";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";

function App() {
  useEffect(() => {
    // Inicializar el manejador de sesión solo si hay un usuario logueado
    if (sessionStorage.getItem("tipoUsuario")) {
      initSessionManager();
    }
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
          <Route path="/terminos-condiciones" element={<TermsAndConditions />} />

          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/verify-pending" element={<VerifyPending />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/gimnasios" element={<Gimnasios />} />
          <Route path="/libros-ejercicios" element={<LibrosEjercicios />} />
          <Route path="/gimnasios/:id" element={<GimnasioDetalle />} />
          <Route path="/citas/instructor/:id" element={<InstructorDetail />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mis-citas" element={<MisCitas />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/solicitudes" element={<SolicitudesAdmin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
