<template>
  <div class="page-container">
    <!-- Header principal & Buscador -->
    <div class="hero-section">
      <h1>🌴 Descubre Nuestros Paquetes Turísticos</h1>
      <p>Explora destinos increíbles con los mejores precios y experiencias inolvidables</p>

      <!-- Barra de Búsqueda por Nombre (Requerimiento #5) -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar paquete turístico por nombre..."
        />
        <button v-if="searchQuery" @click="clearSearch" class="btn-clear">❌</button>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="content-section">
      <div class="toolbar">
        <span class="results-count">
          Mostrando {{ meta.total ? (meta.page - 1) * meta.limit + 1 : 0 }} - 
          {{ Math.min(meta.page * meta.limit, meta.total) }} de <strong>{{ meta.total }}</strong> paquetes
        </span>

        <div class="limit-selector">
          <label>Mostrar por página:</label>
          <select v-model.number="limit" @change="fetchPaquetes(1)">
            <option :value="6">6</option>
            <option :value="9">9</option>
            <option :value="12">12</option>
            <option :value="15">15</option>
          </select>
        </div>
      </div>

      <!-- Estado de Carga -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando paquetes turísticos...</p>
      </div>

      <!-- Sin Resultados -->
      <div v-else-if="paquetes.length === 0" class="empty-state">
        <span class="empty-icon">🏖️</span>
        <h3>No se encontraron paquetes turísticos</h3>
        <p v-if="searchQuery">No hay resultados para "{{ searchQuery }}". Intenta con otro término.</p>
        <button v-if="searchQuery" @click="clearSearch" class="btn-reset">Ver todos los paquetes</button>
      </div>

      <!-- Grid de Paquetes -->
      <div v-else class="packages-grid">
        <div v-for="paquete in paquetes" :key="paquete.id" class="package-card">
          <div class="card-image">
            <img :src="paquete.imagen" :alt="paquete.nombre" @error="handleImageError" />
            <span class="badge-price">${{ paquete.precio }} USD</span>
          </div>

          <div class="card-body">
            <div class="card-destination">📍 {{ paquete.destino }}</div>
            <h3 class="card-title">{{ paquete.nombre }}</h3>
            <p class="card-description">{{ paquete.descripcion }}</p>

            <div class="card-meta">
              <span>⏱️ {{ paquete.duracionDias }} Días / {{ paquete.duracionDias - 1 }} Noches</span>
              <span :class="['badge-seats', paquete.cuposDisponibles > 5 ? 'seats-ok' : 'seats-low']">
                🎟️ {{ paquete.cuposDisponibles }} cupos
              </span>
            </div>
          </div>

          <!-- Acciones protegidas por JWT -->
          <div v-if="isAuthenticated" class="card-actions">
            <router-link :to="`/paquetes/editar/${paquete.id}`" class="btn-edit">
              ✏️ Editar
            </router-link>
            <button @click="confirmDelete(paquete)" class="btn-delete">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Paginación (Requerimiento #6) -->
      <div v-if="meta.totalPages > 1" class="pagination-container">
        <button
          :disabled="!meta.hasPrevPage || loading"
          @click="fetchPaquetes(meta.page - 1)"
          class="btn-page"
        >
          ◀ Anterior
        </button>

        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            :class="['btn-page-number', { active: p === meta.page }]"
            @click="fetchPaquetes(p)"
          >
            {{ p }}
          </button>
        </div>

        <button
          :disabled="!meta.hasNextPage || loading"
          @click="fetchPaquetes(meta.page + 1)"
          class="btn-page"
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { paquetesService } from '../services/paquetes.service';
import { authService } from '../services/auth.service';

const paquetes = ref([]);
const meta = ref({
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
});

const searchQuery = ref('');
const limit = ref(9);
const loading = ref(false);
const isAuthenticated = computed(() => authService.isAuthenticated());

let searchTimeout = null;

const fetchPaquetes = async (page = 1) => {
  loading.value = true;
  try {
    const result = await paquetesService.getPaquetes({
      page,
      limit: limit.value,
      search: searchQuery.value,
    });
    paquetes.value = result.data;
    meta.value = result.meta;
  } catch (err) {
    console.error('Error al cargar paquetes:', err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchPaquetes(1);
  }, 350);
};

const clearSearch = () => {
  searchQuery.value = '';
  fetchPaquetes(1);
};

const confirmDelete = async (paquete) => {
  if (confirm(`¿Estás seguro de que deseas eliminar el paquete "${paquete.nombre}"?`)) {
    try {
      await paquetesService.deletePaquete(paquete.id);
      fetchPaquetes(meta.value.page);
    } catch (err) {
      alert('Error al eliminar el paquete: ' + (err.response?.data?.message || err.message));
    }
  }
};

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
};

const visiblePages = computed(() => {
  const current = meta.value.page;
  const total = meta.value.totalPages;
  const pages = [];
  
  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

onMounted(() => {
  fetchPaquetes(1);
});
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.hero-section h1 {
  font-size: 2.25rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.hero-section p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  max-width: 550px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.search-box input {
  width: 100%;
  padding: 0.85rem 2.75rem;
  border-radius: 2rem;
  border: 2px solid #cbd5e1;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1rem rgba(0, 0, 0, 0.1);
}

.search-box input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
}

.btn-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #64748b;
}

.limit-selector select {
  margin-left: 0.5rem;
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.package-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-price {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: #0284c7;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.card-body {
  padding: 1.25rem;
  flex-grow: 1;
}

.card-destination {
  font-size: 0.85rem;
  color: #0284c7;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.card-title {
  font-size: 1.15rem;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.card-description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #475569;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.75rem;
}

.badge-seats {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
}

.seats-ok { background: #dcfce7; color: #166534; }
.seats-low { background: #fee2e2; color: #991b1b; }

.card-actions {
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-edit { background: #e0f2fe; color: #0369a1; }
.btn-delete { background: #fee2e2; color: #991b1b; }

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
}

.btn-page {
  padding: 0.6rem 1rem;
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.btn-page-number {
  width: 38px;
  height: 38px;
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-page-number.active {
  background: #0284c7;
  color: white;
  border-color: #0284c7;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0284c7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
