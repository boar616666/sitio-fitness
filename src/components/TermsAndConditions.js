import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="legal-document">
      <h1>Términos y Condiciones de FitnessPro</h1>
      <p><strong>Última actualización:</strong> [Fecha]</p>

      {/* Secciones clave */}
      <section>
        <h2>1. Aceptación de términos</h2>
        <p>
          Al registrarte en FitnessPro, aceptas estos términos y nuestra 
          <Link to="/privacidad"> Política de Privacidad</Link>.
        </p>
      </section>

      <section>
        <h2>2. Uso del servicio</h2>
        <ul>
          <li>Prohibido compartir tu cuenta o acceder a contenido premium sin autorización.</li>
          <li>Debes ser mayor de 16 años (o tener consentimiento parental).</li>
        </ul>
      </section>

      <section>
        <h2>3. Contenido y propiedad intelectual</h2>
        <p>
          Los vídeos y programas de entrenamiento son propiedad de FitnessPro. 
          No puedes redistribuirlos sin permiso.
        </p>
      </section>

      <section>
        <h2>4. Limitación de responsabilidad</h2>
        <p>
          FitnessPro no se hace responsable de lesiones derivadas del mal uso 
          de los ejercicios recomendados.
        </p>
      </section>

      <section>
        <h2>5. Modificaciones</h2>
        <p>
          Podemos actualizar estos términos. Te notificaremos por email o mediante 
          un aviso en la plataforma.
        </p>
      </section>

      <div className="legal-footer">
        <Link to="/" className="back-button">← Volver al inicio</Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;