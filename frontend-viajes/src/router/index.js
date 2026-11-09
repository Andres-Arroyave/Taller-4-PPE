// Importamos las funciones necesarias de vue-router para crear el enrutador
import { createRouter, createWebHistory } from 'vue-router';
// Importamos authService para consultar dinámicamente si existe una sesión activa
import { authService } from '../services/auth.service';
// Importamos los componentes de vista que se mostrarán en cada ruta
import PaquetesView from '../views/PaquetesView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PaqueteFormView from '../views/PaqueteFormView.vue';

// Definición de las rutas navegables de la aplicación frontend
const routes = [
  {
    path: '/',                     // Ruta raíz: http://localhost:5173/
    name: 'Home',                  // Nombre interno de la ruta
    component: PaquetesView,       // Muestra la vista principal del catálogo de paquetes
  },
  {
    path: '/login',                // Ruta del formulario de inicio de sesión
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',             // Ruta del formulario de registro
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/paquetes/crear',       // Ruta protegida para crear un paquete
    name: 'CrearPaquete',
    component: PaqueteFormView,
    meta: { requiresAuth: true },  // Marca esta ruta exigiendo autenticación previa
  },
  {
    path: '/paquetes/editar/:id',  // Ruta protegida para editar un paquete existente por su ID
    name: 'EditarPaquete',
    component: PaqueteFormView,
    meta: { requiresAuth: true },  // Marca esta ruta exigiendo autenticación previa
  },
  {
    path: '/:pathMatch(.*)*',      // Captura cualquier ruta inexistente
    redirect: '/',                 // Redirige automáticamente al catálogo principal
  },
];

// Instanciamos el router usando el historial HTML5 de navegación del navegador
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard de Vue Router (Requerimiento #13): Se ejecuta automáticamente antes de cada cambio de página
router.beforeEach((to, from, next) => {
  // Evaluamos si el usuario actualmente posee un token de sesión en localStorage
  const isAuthenticated = authService.isAuthenticated();

  // Si la ruta destino exige autenticación y el usuario NO tiene token activo
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirige forzosamente hacia la pantalla de Login
    next('/login');
  } 
  // Si el usuario ya está autenticado e intenta entrar a Login o Registro
  else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    // Redirige hacia el catálogo principal evitando pantallas redundantes
    next('/');
  } 
  // En cualquier otro caso, permite el paso hacia la vista solicitada
  else {
    next();
  }
});

// Exportamos la configuración del enrutador para registrarla en main.js
export default router;
