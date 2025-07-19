// src/utils/sanitization.js

// Elimina etiquetas HTML y caracteres peligrosos
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>?/gm, '').replace(/[&<>"']/g, '');
};

// Para URLs: bloquea javascript: y sanitiza
export const sanitizeUrl = (url) => {
    if (typeof url !== 'string') return '';
    const clean = url.replace(/<[^>]*>?/gm, '').replace(/[&<>"']/g, '');
    return clean.toLowerCase().startsWith('javascript:') ? '' : clean;
};