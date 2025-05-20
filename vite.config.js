import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno (prefijo VITE_)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // Configuración del servidor en desarrollo
    server: {
      port: 5173, // Puerto del frontend en desarrollo
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000', // Usa la variable o fallback a localhost
          changeOrigin: true,
          secure: false, // En desarrollo, puede ser false (true en producción)
          rewrite: (path) => path.replace(/^\/api/, '') // Elimina /api al redirigir
        }
      }
    },

    // Configuración para producción
    build: {
      outDir: 'dist', // Carpeta de salida
      sourcemap: true // Opcional: generar sourcemaps
    },

    // Definir variables accesibles en el cliente
    define: {
      'process.env': {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL) // Pasa la URL al cliente
      }
    }
  };
});