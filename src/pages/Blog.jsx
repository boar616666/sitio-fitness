// src/pages/Blog.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import ScrollToTop from "../components/ScrollToTop";

const Blog = () => {
  const isLoggedIn = !!sessionStorage.getItem("correo");
  const userName = sessionStorage.getItem("nombre");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "CarlosFit",
      text: "Excelente blog! Los libros me han ayudado mucho con mi rutina en casa.",
      date: "10/04/2025",
    },
    {
      id: 2,
      user: "AnaSports",
      text: "Me encantaría que agregaran más contenido sobre yoga y estiramientos.",
      date: "08/04/2025",
    },
    {
      id: 3,
      user: "MarioGym",
      text: "Muy buenos consejos, especialmente para principiantes como yo.",
      date: "05/04/2025",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const comment = {
      id: comments.length + 1,
      user: "UsuarioActual", // Reemplazar con el nombre del usuario real
      text: newComment,
      date: new Date().toLocaleDateString(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="blog-container">
      <div className="blog-box">
        <h1>Blog de Fitness</h1>
        <Breadcrumbs />
        <p className="blog-description">
          En nuestro blog encontrarás consejos, rutinas y recomendaciones para
          mantenerte en forma. Además, hemos preparado una colección de libros
          PDF con ejercicios para que puedas entrenar desde casa o en el
          gimnasio. ¡Descárgalos y comienza tu rutina hoy mismo!
        </p>
        {isLoggedIn ? (
          <Link to="/libros-ejercicios" className="blog-button">
            Ver Libros de Ejercicios
          </Link>
        ) : (
          <div className="auth-prompt">
            <p className="auth-message">
              Para acceder a nuestra colección de libros de ejercicios,
              necesitas iniciar sesión
            </p>
            <div className="auth-buttons">
              <Link to="/login" className="blog-button">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="blog-button secondary">
                Registrarse
              </Link>
            </div>
          </div>
        )}

        {/* Sección de Comentarios */}
        <div
          className="comments-section"
          style={{ marginTop: "2rem", width: "100%" }}
        >
          <h2>Comentarios ({comments.length})</h2>

          {isLoggedIn ? (
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario..."
              />
              <button onClick={handleAddComment}>Publicar Comentario</button>
            </div>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Inicia sesión</Link> para dejar un comentario.
            </p>
          )}

          {/* Lista de Comentarios */}
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-card"
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "1rem",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  borderLeft: "3px solid var(--primary-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong style={{ color: "var(--primary-color)" }}>
                    {comment.user}
                  </strong>
                  <span style={{ color: "#666", fontSize: "0.8rem" }}>
                    {comment.date}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Blog;
