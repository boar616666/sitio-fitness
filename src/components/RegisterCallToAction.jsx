import { Link } from "react-router-dom";
import "../styles/login.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { sanitizeInput, sanitizeUrl } from "../utils/sanitization";

// Configura Axios para usar la URL base correcta
const api = axios.create({
  baseURL: "https://backend-gimnasio-lu0e.onrender.com"
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
  const registerUrl = `/register?type=${sanitizeInput(type)}`;

  const handleButtonClick = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/validar-captcha", {
        captchaToken: sanitizeInput(captchaToken),
      });

      if (response.data.success) {
        window.location.href = sanitizeUrl(registerUrl);
      } else {
        setError("CAPTCHA inválido. Por favor, inténtalo de nuevo.");
        resetCaptcha();
      }
    } catch (error) {
      console.error("Error al validar CAPTCHA:", error);
      setError(sanitizeInput(error.response?.data?.error || "Error al verificar el CAPTCHA"));
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
      <h3 className="register-cta-title">{sanitizeInput(title)}</h3>
      <p className="register-cta-description">{sanitizeInput(description)}</p>

      {showCaptcha && !captchaVerified && (
        <div className="captcha-container">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => {
              setCaptchaVerified(true);
              setCaptchaToken(sanitizeInput(token));
              setShowCaptcha(false);
            }}
            onExpired={resetCaptcha}
          />
        </div>
      )}

      <Link 
        to={sanitizeUrl(registerUrl)} 
        className={`register-cta-button ${isLoading ? "loading" : ""}`}
        onClick={handleButtonClick}
      >
        {isLoading ? "Verificando..." : sanitizeInput(buttonText)}
      </Link>

      {error && <p className="captcha-error">{error}</p>}

      {showCaptcha && !captchaVerified && (
        <p className="captcha-message">Por favor, completa el CAPTCHA para continuar.</p>
      )}
    </div>
  );
}

export default RegisterCallToAction;