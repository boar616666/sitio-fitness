import React from "react";
import "../styles/legal.css"; // Asegúrate de tener un archivo CSS para estilos

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-title">AVISO DE PRIVACIDAD</h1>
      <p className="privacy-update">Última actualización: {new Date().toLocaleDateString()}</p>

      <div className="privacy-section">
        <h2>1. Responsable del tratamiento de datos</h2>
        <p>
          Sitio FitnessPro, con domicilio en Lomas del parque, es responsable de recabar, usar y proteger los datos personales que nos proporciones a través de nuestro sitio web https://sitio-fitness.onrender.com/politica-privacidad.
        </p>
      </div>

      <div className="privacy-section">
        <h2>2. Datos personales que recabamos</h2>
        <p><strong>Para usuarios registrados (clientes):</strong></p>
        <ul>
          <li>Correo electrónico.</li>
          <li>Nombre de usuario.</li>
          <li>Contraseña segura (encriptada).</li>
        </ul>

        <p><strong>Para entrenadores registrados:</strong></p>
        <ul>
          <li>Correo electrónico.</li>
          <li>Nombre de usuario.</li>
          <li>Contraseña segura (encriptada).</li>
          <li>Gimnasio asociado (seleccionado de nuestra base de datos).</li>
          <li>URL de foto de perfil.</li>
          <li>Edad.</li>
          <li>Costo por sesión.</li>
          <li>Costo mensual.</li>
          <li>Número de teléfono.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>3. Finalidades del tratamiento</h2>
        <p>Tus datos se utilizan para:</p>
        <ul>
          <li>Crear y gestionar tu cuenta.</li>
          <li>Mostrar información de gimnasios y entrenadores cercanos.</li>
          <li>Facilitar la agenda de citas entre usuarios y entrenadores.</li>
          <li>Publicar contenido en el blog (consejos, ejercicios, etc.).</li>
          <li>Compartir recursos educativos (PDF, videos).</li>
          <li>Enviar comunicaciones relacionadas con el servicio (no spam).</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>4. Bases legales para el tratamiento</h2>
        <ul>
          <li><strong>Consentimiento:</strong> Al registrarte, aceptas este aviso.</li>
          <li><strong>Ejecución de un contrato:</strong> Para gestionar tu cuenta y citas.</li>
          <li><strong>Interés legítimo:</strong> Mejorar nuestros servicios y seguridad.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>5. Compartir datos con terceros</h2>
        <p>Tus datos <strong>no se venden</strong>. Solo se comparten en estos casos:</p>
        <ul>
          <li><strong>Entrenadores y gimnasios:</strong> Para coordinar citas.</li>
          <li><strong>Proveedores de servicios:</strong> Hosting, email</li>
          <li><strong>Obligaciones legales:</strong> Si una autoridad lo requiere.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>6. Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)</h2>
        <p>Puedes:</p>
        <ul>
          <li>Solicitar acceso a tus datos.</li>
          <li>Corregir información incorrecta.</li>
          <li>Cancelar tu cuenta.</li>
          <li>Oponerte al uso de tus datos para fines específicos.</li>
        </ul>
        <p>Para ejercer estos derechos, escríbenos a: <a href="josueomarnunezgodinez@gmaiil.com">"josueomarnunezgodinez@gmaiil.com"</a>.</p>
      </div>

      <div className="privacy-section">
        <h2>7. Seguridad de los datos</h2>
        <p>Usamos medidas técnicas (encriptación, firewalls) y administrativas para proteger tu información. Sin embargo, ningún sistema es 100% invulnerable.</p>
      </div>

      <div className="privacy-section">
        <h2>8. Cookies y tecnologías similares</h2>
        <p>Utilizamos cookies para:</p>
        <ul>
          <li>Mejorar la experiencia de usuario.</li>
          <li>Analizar tráfico.</li>
        </ul>
        <p>Puedes gestionarlas en la configuración de tu navegador.</p>
      </div>

      <div className="privacy-section">
        <h2>9. Cambios al aviso</h2>
        <p>Notificaremos cambios mediante un banner en el sitio o por correo.</p>
      </div>

      <div className="privacy-contact">
        <h2>Contacto</h2>
        <p>Para dudas o ejercer derechos, escríbenos a: <a href="josueomarnunezgodinez@gmaiil.com"></a> o llama al 4186903203.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;