// src/pages/LibrosEjercicios.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import LibroCard from "../components/LibroCard";
import "../styles/global.css";

// Importar el worker desde node_modules
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const LibrosEjercicios = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const libros = [
    {
      id: 1,
      titulo: "Rutinas de Cardio",
      descripcion: "Descubre las mejores rutinas de cardio para quemar grasa y mejorar tu resistencia.",
      archivo: "/Libros/libro1.pdf", // Ruta en la carpeta public
    },
    {
      id: 2,
      titulo: "Entrenamiento con Pesas",
      descripcion: "Aprende a realizar ejercicios con pesas para ganar fuerza y masa muscular.",
      archivo: "/libros/libro2.pdf", // Ruta en la carpeta public
    },
    {
      id: 3,
      titulo: "Yoga y Estiramientos",
      descripcion: "Mejora tu flexibilidad y relájate con estas rutinas de yoga y estiramientos.",
      archivo: "/libros/libro3.pdf", // Ruta en la carpeta public
    },
  ];

  const handlePdfClick = (archivo) => {
    setSelectedPdf(archivo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPdf(null);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="libros-page-container">
      <div className="libros-box">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">&gt;</span>
          <Link to="/blog">Blog</Link>
          <span className="separator">&gt;</span>
          <span>Libros de Ejercicios</span>
        </div>

        {/* Título */}
        <h1>Libros de Ejercicios</h1>

        {/* Lista de libros en una línea horizontal */}
        <div className="libros-list-horizontal">
          {libros.map((libro) => (
            <LibroCard 
              key={libro.id} 
              libro={libro} 
              onPdfClick={handlePdfClick}
            />
          ))}
        </div>

        {/* Modal para mostrar el PDF */}
        {modalIsOpen && (
          <div className="pdf-modal-overlay">
            <div className="pdf-modal">
              <button className="close-modal" onClick={closeModal}>×</button>
              <div className="pdf-container">
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
                {numPages && (
                  <div className="pdf-controls">
                    <button 
                      onClick={() => setPageNumber(pageNumber - 1)}
                      disabled={pageNumber <= 1}
                    >
                      Anterior
                    </button>
                    <span>Página {pageNumber} de {numPages}</span>
                    <button 
                      onClick={() => setPageNumber(pageNumber + 1)}
                      disabled={pageNumber >= numPages}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrosEjercicios;