// utils/sanitization.js - Versión mejorada

/**
 * Elimina TODAS las formas de etiquetas HTML y caracteres peligrosos
 * @param {string} input - Texto a sanitizar
 * @returns {string} Texto seguro
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    
    // Patrón que detecta TODAS las variantes de etiquetas HTML
    const htmlTagPattern = /<[^>]*>?/gm;
    
    // Caracteres peligrosos a eliminar
    const dangerousChars = /[&<>"'`=\\/]/g;
    
    // Primero elimina etiquetas HTML
    let cleanText = input.replace(htmlTagPattern, '');
    
    // Luego elimina caracteres peligrosos
    cleanText = cleanText.replace(dangerousChars, '');
    
    return cleanText;
};

/**
 * Sanitiza URLs bloqueando javascript: y otros protocolos peligrosos
 * @param {string} url - URL a verificar
 * @returns {string} URL segura o cadena vacía si es peligrosa
 */
export const sanitizeUrl = (url) => {
    if (typeof url !== 'string') return '';
    
    // Sanitiza como input normal primero
    let cleanUrl = sanitizeInput(url);
    
    // Bloquea URLs que comiencen con protocolos peligrosos
    const dangerousProtocols = [
        'javascript:', 'data:', 'vbscript:', 
        'about:', 'file:', 'blob:'
    ];
    
    const lowerUrl = cleanUrl.toLowerCase();
    if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
        return '';
    }
    
    return cleanUrl;
};