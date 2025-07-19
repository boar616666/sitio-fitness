// utils/sanitization.js

// Versión corregida - Elimina etiquetas HTML y caracteres peligrosos
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Elimina todas las etiquetas HTML
    let output = input.replace(/<[^>]*>/g, '');
    
    // Reemplaza caracteres especiales peligrosos
    output = output.replace(/[&<>"']/g, '');
    
    return output;
};

// Para URLs: bloquea javascript: y sanitiza
export const sanitizeUrl = (url) => {
    if (typeof url !== 'string') return '';
    
    // Elimina etiquetas HTML
    let clean = url.replace(/<[^>]*>/g, '');
    
    // Reemplaza caracteres especiales
    clean = clean.replace(/[&<>"']/g, '');
    
    // Bloquea URLs que comiencen con javascript:
    return clean.toLowerCase().startsWith('javascript:') ? '' : clean;
};