import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";

import Login from "./pages/Login";
import Videos from "./pages/Videos";
import Gimnasios from "./pages/Gimnasios";
import ErrorPage from "./pages/ErrorPage";
import Header from "./components/header"; 
import Footer from "./components/Footer"; 
import GimnasioDetalle from "./pages/GimnasioDetalle";
import LibrosEjercicios from "./pages/LibrosEjercicios";
import InstructorDetail from "./components/InstructorDetail";
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import VerifyPending from './pages/VerifyPending';


function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/verify-pending" element={<VerifyPending />} />
          <Route path="/login" element={<Login />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/gimnasios" element={<Gimnasios />} />
          <Route path="/libros-ejercicios" element={<LibrosEjercicios />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/gimnasios/:id" element={<GimnasioDetalle />} />
          <Route path="/citas/instructor/:id" element={<InstructorDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;