<template>
  <header class="navbar">
    <div class="container">
      <router-link to="/" class="brand">
        <span class="logo-icon">✈️</span>
        <span class="brand-name">Agencia<strong>Viajes</strong></span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-item">Catalog de Paquetes</router-link>
        
        <template v-if="isAuthenticated">
          <router-link to="/paquetes/crear" class="btn-create">
            ➕ Crear Paquete
          </router-link>
          
          <div class="user-menu">
            <span class="user-badge">👤 {{ currentUser?.nombre || 'Usuario' }}</span>
            <button @click="handleLogout" class="btn-logout" title="Cerrar Sesión">
              🚪 Salir
            </button>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
          <router-link to="/register" class="btn-register">Registrarse</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '../services/auth.service';

const router = useRouter();
const route = useRoute();

const isAuthenticated = ref(false);
const currentUser = ref(null);

const checkAuth = () => {
  isAuthenticated.value = authService.isAuthenticated();
  currentUser.value = authService.getUser();
};

onMounted(() => {
  checkAuth();
});

watch(route, () => {
  checkAuth();
});

const handleLogout = () => {
  authService.logout();
  checkAuth();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background: #1e293b;
  color: #ffffff;
  padding: 1rem 0;
  box-shadow: 0 4px 6px -1rem rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #ffffff;
  font-size: 1.25rem;
}

.brand-name strong {
  color: #38bdf8;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-item, .nav-link {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item:hover, .nav-link:hover {
  color: #38bdf8;
}

.btn-create {
  background: #0284c7;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-create:hover {
  background: #0369a1;
}

.btn-register {
  background: #38bdf8;
  color: #0f172a;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-badge {
  background: #334155;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  color: #f1f5f9;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.btn-logout:hover {
  background: #dc2626;
}
</style>
