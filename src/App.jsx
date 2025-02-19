import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Citas from "./pages/Citas";
import Login from "./pages/Login";
import Header from "./components/header";
import Footer from "./components/Footer";
import Videos from "./pages/Videos";
import ErrorPage from "./pages/Errorpage"; 

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
          <Route path="/videos" element={<Videos/>} /> 
         
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
