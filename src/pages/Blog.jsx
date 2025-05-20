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
  const [draggedComment, setDraggedComment] = useState(null);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const comment = {
      id: comments.length + 1,
      user: userName || "Anónimo", // Usamos el nombre del usuario desde sessionStorage
      text: newComment,
      date: new Date().toLocaleDateString(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleDragStart = (e, commentId) => {
    e.target.classList.add('dragging');
    setDraggedComment(commentId);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropId) => {
    e.preventDefault();
    const commentsCopy = [...comments];
    const draggedIndex = commentsCopy.findIndex(c => c.id === draggedComment);
    const dropIndex = commentsCopy.findIndex(c => c.id === dropId);
    
    const [removed] = commentsCopy.splice(draggedIndex, 1);
    commentsCopy.splice(dropIndex, 0, removed);
    
    setComments(commentsCopy);
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
                draggable
                onDragStart={(e) => handleDragStart(e, comment.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, comment.id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <strong style={{ color: "var(--primary-color)" }}>
                      {comment.user}
                    </strong>
                    {/* Mostrar botón de eliminar solo si el comentario es del usuario actual */}
                    {comment.user === userName && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-comment-btn"
                        title="Eliminar comentario"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <span style={{ color: "#666", fontSize: "0.8rem" }}>
                    {comment.date}
                  </span>
                </div>
                <div className="comment-text-container">
                  {comment.text.length > 150 ? (
                    <>
                      <p className="comment-text">
                        {comment.text.slice(0, 150)}
                        <span className="comment-full" style={{ display: 'none' }}>
                          {comment.text.slice(150)}
                        </span>
                        <span className="comment-dots">...</span>
                      </p>
                      <button
                        className="expand-button"
                        onClick={(e) => {
                          const container = e.target.previousElementSibling;
                          const fullText = container.querySelector('.comment-full');
                          const dots = container.querySelector('.comment-dots');
                          
                          if (fullText.style.display === 'none') {
                            fullText.style.display = 'inline';
                            dots.style.display = 'none';
                            e.target.textContent = 'Ver menos';
                          } else {
                            fullText.style.display = 'none';
                            dots.style.display = 'inline';
                            e.target.textContent = 'Ver más';
                          }
                        }}
                      >
                        Ver más
                      </button>
                    </>
                  ) : (
                    <p className="comment-text">{comment.text}</p>
                  )}
                </div>
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