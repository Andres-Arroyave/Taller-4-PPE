/**
 * =========================================================================================
 * 🔌 CÓMO SE COMUNICAN EL FRONTEND (VUE 3) Y EL BACKEND (NESTJS)
 * =========================================================================================
 * 
 * 1. PUERTO Y PROTOCOLO:
 *    - El Frontend en Vue 3 se ejecuta en el navegador (http://localhost:5173).
 *    - El Backend en NestJS escucha peticiones HTTP en (http://localhost:3000).
 * 
 * 2. ENVÍO DE DATOS Y CABECERAS:
 *    - Esta instancia de Axios es el puente oficial entre ambos mundos.
 *    - Cada petición HTTP (GET, POST, PATCH, DELETE) envía un paquete JSON al servidor.
 * 
 * 3. PASO DE SEGURIDAD (INTERCEPTOR DE TOKEN JWT):
 *    - Cuando el usuario hace Login, el token retornado por NestJS se almacena en 'localStorage'.
 *    - El interceptor definido abajo captura CADA PETICIÓN antes de salir hacia el servidor NestJS
 *      e inyecta la cabecera: 'Authorization: Bearer <token>'
 *    - Con esto, NestJS mediante 'JwtAuthGuard' sabe qué usuario está realizando la acción.
 * =========================================================================================
 */

// Importamos la librería Axios para realizar peticiones HTTP asíncronas
import axios from 'axios';

// Creamos una instancia personalizada de Axios con la configuración base del servidor
const api = axios.create({
  // Lee dinámicamente la URL del servidor backend desde el archivo .env (http://localhost:3000)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  // Especifica que todas las peticiones enviarán datos en formato JSON
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones: Se ejecuta automáticamente ANTES de que cualquier solicitud salga hacia el servidor (Requerimiento #12)
api.interceptors.request.use((config) => {
  // Busca si existe un token de sesión guardado previamente en el localStorage del navegador
  const token = localStorage.getItem('token');
  // Si el token existe, lo inyecta dinámicamente en el encabezado de autorización
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Devuelve la configuración modificada para enviar la petición HTTP
  return config;
}, (error) => {
  // Maneja cualquier error previo al envío de la petición
  return Promise.reject(error);
});

// Exportamos la instancia de axios ya configurada para ser usada en toda la app de Vue 3
export default api;
