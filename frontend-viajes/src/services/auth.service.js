// Importamos nuestra instancia configurada de Axios (api.js)
import api from './api';

// Definimos un objeto con los métodos de autenticación de la aplicación
export const authService = {
  // Método asíncrono para enviar los datos de registro de un nuevo usuario
  async register(email, nombre, password) {
    // Hace una petición POST a http://localhost:3000/auth/register enviando el cuerpo en JSON
    const response = await api.post('/auth/register', { email, nombre, password });
    // Si el backend devuelve un token de acceso válido en la respuesta
    if (response.data.accessToken) {
      // Guarda el token JWT en el almacenamiento local del navegador (localStorage)
      localStorage.setItem('token', response.data.accessToken);
      // Guarda los datos del usuario en localStorage convertidos a string JSON
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    // Retorna la respuesta completa entregada por el servidor
    return response.data;
  },

  // Método asíncrono para autenticar un usuario existente mediante login
  async login(email, password) {
    // Hace una petición POST a http://localhost:3000/auth/login enviando las credenciales
    const response = await api.post('/auth/login', { email, password });
    // Si la autenticación fue exitosa y recibimos el token JWT
    if (response.data.accessToken) {
      // Persiste el token JWT en el navegador
      localStorage.setItem('token', response.data.accessToken);
      // Persiste la información pública del usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    // Devuelve los datos retornados por la API
    return response.data;
  },

  // Método para cerrar la sesión activa del usuario (Requerimiento #14)
  logout() {
    // Elimina la clave del token JWT de localStorage
    localStorage.removeItem('token');
    // Elimina la clave del usuario de localStorage
    localStorage.removeItem('user');
  },

  // Método auxiliar para obtener el token JWT actualmente almacenado
  getToken() {
    return localStorage.getItem('token');
  },

  // Método auxiliar para obtener el usuario autenticado parseado desde JSON
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Método auxiliar que devuelve true si el usuario tiene una sesión activa (token guardado)
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
