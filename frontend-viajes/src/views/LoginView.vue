<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>🔑 Iniciar Sesión</h2>
      <p class="auth-subtitle">Ingresa tus credenciales para administrar los paquetes turísticos</p>

      <div v-if="error" class="alert-error">
        ⚠️ {{ error }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input
            v-model="email"
            type="email"
            placeholder="ejemplo@agencia.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Iniciando sesión...' : 'Ingresar' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authService.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión. Verifica tus datos.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.auth-card {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  border: 1px solid #e2e8f0;
}

h2 {
  margin: 0 0 0.5rem 0;
  color: #0f172a;
}

.auth-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
  margin-bottom: 0.375rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.btn-submit {
  width: 100%;
  background: #0284c7;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background: #0369a1;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #0284c7;
  text-decoration: none;
  font-weight: 600;
}
</style>
