import { Link } from "react-router-dom";
import "../styles/login.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

// Configura Axios para usar la URL base correcta
const api = axios.create({
  baseURL: "http://localhost:3000", // Asegúrate que coincida con tu puerto del backend
});

function RegisterCallToAction({ 
  title, 
  description, 
  buttonText = "Regístrate ahora", 
  type = "usuario" 
}) {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const RECAPTCHA_SITE_KEY = "6LdFFQgrAAAAAA-FMYiSLoVzBL1iNKR79XPU7mFy";
  const registerUrl = `/register?type=${type}`;

  const handleButtonClick = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    setIsLoading(true);

    try {
      // Cambiado a la ruta correcta /auth/validar-captcha
      const response = await api.post("/auth/validar-captcha", {
        captchaToken: captchaToken,
      });

      if (response.data.success) {
        window.location.href = registerUrl;
      } else {
        setError("CAPTCHA inválido. Por favor, inténtalo de nuevo.");
        resetCaptcha();
      }
    } catch (error) {
      console.error("Error al validar CAPTCHA:", error);
      setError(error.response?.data?.error || "Error al verificar el CAPTCHA");
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const resetCaptcha = () => {
    setCaptchaVerified(false);
    setCaptchaToken("");
    setShowCaptcha(true);
  };

  return (
    <div className="register-cta-container">
      <h3 className="register-cta-title">{title}</h3>
      <p className="register-cta-description">{description}</p>

      {showCaptcha && !captchaVerified && (
        <div className="captcha-container">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => {
              setCaptchaVerified(true);
              setCaptchaToken(token);
              setShowCaptcha(false);
            }}
            onExpired={resetCaptcha}
          />
        </div>
      )}

      <Link 
        to={registerUrl} 
        className={`register-cta-button ${isLoading ? "loading" : ""}`}
        onClick={handleButtonClick}
      >
        {isLoading ? "Verificando..." : buttonText}
      </Link>

      {error && <p className="captcha-error">{error}</p>}

      {showCaptcha && !captchaVerified && (
        <p className="captcha-message">Por favor, completa el CAPTCHA para continuar.</p>
      )}
    </div>
  );
}

export default RegisterCallToAction;