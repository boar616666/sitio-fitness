// src/pages/LibrosEjercicios.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import LibroCard from "../components/LibroCard";
import "../styles/global.css";

// Configuración correcta del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
      archivo: "/Libros/libro1.pdf",
    },
    {
      id: 2,
      titulo: "Entrenamiento con Pesas",
      descripcion: "Aprende a realizar ejercicios con pesas para ganar fuerza y masa muscular.",
      archivo: "/Libros/libro2.pdf",
    },
    {
      id: 3,
      titulo: "Entrenamiento de Fuerza, Estiramientos y Movilidad",
      descripcion: "Una guía completa sobre ejercicios de fuerza, técnicas de estiramiento y movilidad articular.",
      archivo: "https://www.sobrarbe.com/descargas/entrenamiento_fuerza_estiramientos_y_movilidad.pdf",
    },
  ];

  const handlePdfClick = (archivo) => {
    setSelectedPdf(archivo);
    setModalIsOpen(true);
    setPageNumber(1); // Resetear página al abrir nuevo PDF
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPdf(null);
    setNumPages(null);
    setPageNumber(1);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const nextPageNumber = prevPageNumber + offset;
      if (nextPageNumber > 0 && nextPageNumber <= numPages) {
        return nextPageNumber;
      }
      return prevPageNumber;
    });
  };

  return (
    <div className="libros-page-container">
      <div className="libros-box">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">&gt;</span>
          <Link to="/blog">Blog</Link>
          <span className="separator">&gt;</span>
          <span>Libros de Ejercicios</span>
        </div>

        <h1>Libros de Ejercicios</h1>

        <div className="libros-list-horizontal">
          {libros.map((libro) => (
            <LibroCard 
              key={libro.id} 
              libro={libro} 
              onPdfClick={handlePdfClick}
            />
          ))}
        </div>

        {modalIsOpen && (
          <div className="pdf-modal-overlay" onClick={closeModal}>
            <div className="pdf-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={closeModal}>×</button>
              <div className="pdf-container">
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<div>Cargando PDF...</div>}
                  error={<div>Error al cargar el PDF. Por favor, inténtalo de nuevo.</div>}
                >
                  <Page 
                    pageNumber={pageNumber} 
                    scale={1.2}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
                {numPages && (
                  <div className="pdf-controls">
                    <button 
                      onClick={() => changePage(-1)}
                      disabled={pageNumber <= 1}
                      className="page-button"
                    >
                      Anterior
                    </button>
                    <span className="page-info">
                      Página {pageNumber} de {numPages}
                    </span>
                    <button 
                      onClick={() => changePage(1)}
                      disabled={pageNumber >= numPages}
                      className="page-button"
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
