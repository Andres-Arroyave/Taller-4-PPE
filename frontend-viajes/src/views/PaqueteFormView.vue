<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>{{ isEditing ? '✏️ Editar Paquete Turístico' : '➕ Crear Nuevo Paquete' }}</h2>
        <router-link to="/" class="btn-cancel">Volver al catálogo</router-link>
      </div>

      <div v-if="error" class="alert-error">
        ⚠️ {{ error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Nombre del Paquete *</label>
            <input v-model="form.nombre" type="text" placeholder="Ej. Aventura Extrema en Cancún" required />
          </div>

          <div class="form-group full-width">
            <label>URL de la Imagen *</label>
            <input v-model="form.imagen" type="url" placeholder="https://images.unsplash.com/photo-..." required />
          </div>

          <div class="form-group full-width">
            <label>Destino (Ciudad, País) *</label>
            <input v-model="form.destino" type="text" placeholder="Ej. Cancún, México" required />
          </div>

          <div class="form-group">
            <label>Precio ($ USD) *</label>
            <input v-model.number="form.precio" type="number" min="0" step="0.01" required />
          </div>

          <div class="form-group">
            <label>Duración (Días) *</label>
            <input v-model.number="form.duracionDias" type="number" min="1" required />
          </div>

          <div class="form-group">
            <label>Cupos Disponibles *</label>
            <input v-model.number="form.cuposDisponibles" type="number" min="0" required />
          </div>

          <div class="form-group full-width">
            <label>Descripción detallada *</label>
            <textarea v-model="form.descripcion" rows="4" placeholder="Describe lo que incluye el paquete..." required></textarea>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/" class="btn-secondary">Cancelar</router-link>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Paquete') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { paquetesService } from '../services/paquetes.service';

const route = useRoute();
const router = useRouter();

const paqueteId = computed(() => route.params.id);
const isEditing = computed(() => !!paqueteId.value);

const loading = ref(false);
const error = ref('');

const form = ref({
  nombre: '',
  imagen: '',
  destino: '',
  precio: 500,
  duracionDias: 5,
  cuposDisponibles: 10,
  descripcion: '',
});

onMounted(async () => {
  if (isEditing.value) {
    loading.value = true;
    try {
      const data = await paquetesService.getPaqueteById(paqueteId.value);
      form.value = {
        nombre: data.nombre,
        imagen: data.imagen,
        destino: data.destino,
        precio: data.precio,
        duracionDias: data.duracionDias,
        cuposDisponibles: data.cuposDisponibles,
        descripcion: data.descripcion,
      };
    } catch (err) {
      error.value = 'No se pudo cargar la información del paquete.';
    } finally {
      loading.value = false;
    }
  }
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (isEditing.value) {
      await paquetesService.updatePaquete(paqueteId.value, form.value);
    } else {
      await paquetesService.createPaquete(form.value);
    }
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar el paquete turístico.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0;
  color: #0f172a;
}

.btn-cancel {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.full-width {
  grid-column: span 3;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #334155;
  margin-bottom: 0.35rem;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  box-sizing: border-box;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  text-decoration: none;
  font-weight: 600;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  background: #0284c7;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0369a1;
}
</style>
