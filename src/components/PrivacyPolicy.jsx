import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/legal.css'; // Asegúrate de tener un archivo CSS para estilos

const PrivacyPolicy = () => {
  return (
    <div className="legal-document">
      <h1>Política de Privacidad de FitnessPro</h1>
      <p><strong>Última actualización:</strong> [2 de mayo de 2025]</p>

      {/* Secciones clave */}
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          [Nombre de tu empresa o proyecto], con domicilio en [dirección] y contacto en 
          <a href="mailto:privacidad@fitnesspro.com"> privacidad@fitnesspro.com</a>.
        </p>
      </section>

      <section>
        <h2>2. Datos que recopilamos</h2>
        <ul>
          <li><strong>Datos de registro:</strong> Nombre, email, contraseña (encriptada), edad.</li>
          <li><strong>Datos de actividad:</strong> Vídeos vistos, tiempo de entrenamiento, progreso.</li>
          <li><strong>Tecnológicos:</strong> Cookies, dirección IP, tipo de dispositivo.</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del tratamiento</h2>
        <p>Usamos tus datos para:</p>
        <ul>
          <li>Gestionar tu cuenta y acceso a vídeos exclusivos.</li>
          <li>Personalizar recomendaciones de ejercicios.</li>
          <li>Enviar boletines informativos (solo con tu consentimiento explícito).</li>
        </ul>
      </section>

      <section>
        <h2>4. Bases legales</h2>
        <p>
          Tratamos tus datos bajo:<br />
          - <strong>Consentimiento</strong> (al registrarte).<br />
          - <strong>Interés legítimo</strong> (para análisis de uso y mejora del servicio).
        </p>
      </section>

      <section>
        <h2>5. Derechos ARCO</h2>
        <p>
          Puedes solicitar:<br />
          - <strong>Acceso</strong> a tus datos.<br />
          - <strong>Rectificación</strong> si son incorrectos.<br />
          - <strong>Eliminación</strong> ("derecho al olvido").<br />
          Ejercelos enviando un email a <a href="mailto:privacidad@fitnesspro.com">privacidad@fitnesspro.com</a>.
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          Usamos cookies técnicas y analíticas. Configura tu navegador para rechazarlas 
          (enlace a <Link to="/cookies">Política de Cookies</Link> si aplica).
        </p>
      </section>

      <div className="legal-footer">
        <Link to="/" className="back-button">← Volver al inicio</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;