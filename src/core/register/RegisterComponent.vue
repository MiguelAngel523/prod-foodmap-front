<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const auth = useAuthStore()
const router = useRouter()

const nombre = ref('')
const email = ref('')
const password = ref('')
const rePassword = ref('')
const errorMsg = ref('')
const toast = useToast()

const passwordsMatch = computed(
  () => rePassword.value === '' || password.value === rePassword.value,
)

async function handleRegister() {
  if (passwordsMatch.value) {
    try {
      await auth.register(nombre.value, email.value, password.value)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Usuario creado correctamente: ${email.value}`,
        life: 3000,
      })
      await router.push({ path: '/login' })
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error,
        life: 3000,
      })
    }
  } else {
    errorMsg.value = 'Las contraseñas no coinciden.'
  }
}
</script>

<template>
  <div class="divPage">
    <div class="login-card">
      <h2>Nuevo usuario</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="nombre" type="text" placeholder="Nombre" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Repetir contraseña</label>
          <input v-model="rePassword" type="password" placeholder="••••••••" />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <div class="btnSubmit">
          <button type="submit" class="btnCard botons">Registrarse</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.divPage {
  min-height: 100vh;
  background: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 1px solid #3c2714;
  border-radius: 12px;
  padding: 2.5rem 2rem;
}

.login-card h2 {
  font-size: 2em;
  font-weight: bold;
  margin: 0 0 1.5vh 0;
  color: #000;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  color: #000;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #3c2714;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  background: #fff;
  color: #000;
  transition: border-color 0.2s;
}

.btnSubmit {
  text-align: center;
}

.form-group input:focus {
  border-color: #aaa;
}

.error-msg {
  font-size: 13px;
  color: #c0392b;
  margin: 0 0 8px;
}

:deep(.p-toast-message-error) {
  --p-toast-error-color: #000;
}

.botons{
  margin: 1.5vh 0 1vh 0;
}
</style>