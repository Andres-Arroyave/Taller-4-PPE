// Importamos la instancia de Axios configurada con base URL e interceptores de token
import api from './api';

// Objeto de servicio para gestionar todas las llamadas HTTP al recurso /paquetes
export const paquetesService = {
  // Consulta la lista paginada de paquetes aplicando filtro de búsqueda (Requerimientos #4, #5, #6)
  async getPaquetes({ page = 1, limit = 9, search = '' }) {
    // Construimos el objeto de parámetros URL (?page=1&limit=9)
    const params = { page, limit };
    // Si hay un texto de búsqueda no vacío, lo agregamos a las variables de consulta (?search=Cancun)
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    // Realizamos una petición GET a http://localhost:3000/paquetes pasando los parámetros
    const response = await api.get('/paquetes', { params });
    // Retornamos el cuerpo JSON recibido (contiene los paquetes y la metadata de paginación)
    return response.data;
  },

  // Consulta el detalle de un único paquete por su ID único
  async getPaqueteById(id) {
    // Petición GET a http://localhost:3000/paquetes/:id
    const response = await api.get(`/paquetes/${id}`);
    // Retorna el paquete obtenido
    return response.data;
  },

  // Envía la petición para crear un nuevo paquete turístico (Requerimiento #7)
  async createPaquete(paqueteData) {
    // Petición POST a http://localhost:3000/paquetes (Axios adjunta el token Bearer automáticamente)
    const response = await api.post('/paquetes', paqueteData);
    // Retorna el nuevo paquete creado entregado por NestJS
    return response.data;
  },

  // Envía la petición para actualizar un paquete existente (Requerimiento #7)
  async updatePaquete(id, paqueteData) {
    // Petición PATCH a http://localhost:3000/paquetes/:id
    const response = await api.patch(`/paquetes/${id}`, paqueteData);
    // Retorna el paquete con los datos actualizados
    return response.data;
  },

  // Envía la petición para eliminar un paquete turístico (Requerimiento #7)
  async deletePaquete(id) {
    // Petición DELETE a http://localhost:3000/paquetes/:id
    const response = await api.delete(`/paquetes/${id}`);
    // Retorna la respuesta de confirmación de eliminación
    return response.data;
  },
};
