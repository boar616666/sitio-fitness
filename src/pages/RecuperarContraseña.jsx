import { useState } from "react";

function RecuperarContraseña() {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState("");
  const [token, setToken] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleCorreoSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      const data = await res.json();
      if (data.exito) {
        setMensaje("Correo de recuperación enviado. Revisa tu correo.");
        setStep(2);
      } else {
        setError(data.mensaje || "Correo no registrado.");
      }
    } catch {
      setError("Error en la operación. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (nuevaContrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("api/auth/cambiar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContrasena }),
      });
      const data = await res.json();
      if (data.exito) {
        setMensaje("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
        setStep(3);
      } else {
        setError(data.mensaje || "Token inválido o expirado.");
      }
    } catch {
      setError("Error en la operación. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordStrength("débil");
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = 
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);
    
    if (strength < 2) setPasswordStrength("débil");
    else if (strength < 4) setPasswordStrength("media");
    else setPasswordStrength("fuerte");
    
    return strength >= 2;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNuevaContrasena(value);
    validatePassword(value);
  };

  return (
    <div className="login-container">
      <h2>Recuperar Contraseña</h2>
      {error && <div className="error-message">{error}</div>}
      {mensaje && <div className="mensaje-publicar" style={{ color: "#800020", fontWeight: 500, marginBottom: 12 }}>{mensaje}</div>}

      {step === 1 && (
        <form onSubmit={handleCorreoSubmit}>
          <div className="form-group">
            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Enviando..." : "Enviar correo de recuperación"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTokenSubmit}>
          <div className="form-group">
            <label>Código de verificación:</label>
            <input
              type="text"
              name="token"
              placeholder="Código recibido por correo"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
              maxLength={8}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Nueva contraseña:</label>
            <input
              type="text"
              name="nuevaContrasena"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={handlePasswordChange}
              required
              disabled={loading}
              minLength="8"
            />
            {nuevaContrasena && (
              <div className={`password-strength ${passwordStrength}`}>
                Fortaleza de la contraseña: {passwordStrength}
              </div>
            )}
            <div className="password-requirements">
              La contraseña debe tener al menos:
              <ul>
                <li>8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
                <li>Un carácter especial (!@#$%^&*)</li>
              </ul>
            </div>
          </div>
          <div className="form-group">
            <label>Repetir nueva contraseña:</label>
            <input
              type="password"
              name="repetirContrasena"
              placeholder="Repite la nueva contraseña"
              value={repetirContrasena}
              onChange={e => setRepetirContrasena(e.target.value)}
              required
              disabled={loading}
            />
            {repetirContrasena && (
              <div
                className={`password-match ${
                  nuevaContrasena === repetirContrasena ? "green" : "red"
                }`}
              >
                {nuevaContrasena === repetirContrasena
                  ? "Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"}
              </div>
            )}
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/login" className="toggle-link">
            Ir a iniciar sesión
          </a>
        </div>
      )}
    </div>
  );
}

export default RecuperarContraseña;
