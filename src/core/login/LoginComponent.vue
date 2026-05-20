<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Form, FormField } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const resolver = zodResolver(
  z.object({
    email: z.string().min(1, { message: 'Email es obligatorio.' }),
    password: z.string().min(1, { message: 'La contraseña es es obligatoria.' }),
  }),
)

async function handleLogin({ values, valid }) {
  if (!valid) return

  try {
    await auth.login(values.email, values.password)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data.message,
      life: 3000,
    })
  }
  if (auth.user) {
    await router.push('/')
  }
}
</script>

<template>
  <div class="divPage">
    <div class="login-card">
      <h2>Iniciar sesión</h2>
      <Form :resolver="resolver" @submit="handleLogin" class="divForm">
        <FormField v-slot="$field" name="email" initialValue="" class="divFormField">
          <label>Email</label>
          <InputText
            type="email"
            placeholder="tu@email.com"
            :value="$field.value"
            :invalid="$field.invalid"
            @input="$field.onInput"
            @blur="$field.onBlur"
            @change="$field.onChange"
          />
          <Message v-if="$field.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="password" initialValue="" class="divFormField">
          <label>Contraseña</label>
          <Password
            placeholder="••••••••"
            toggleMask
            :feedback="false"
            :modelValue="$field.value"
            :invalid="$field.invalid"
            @update:modelValue="$field.onInput"
            class="custom-password"
          />
          <Message v-if="$field.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <Button type="submit" label="Iniciar sesión" class="btnCard btn-login" />
      </Form>
      <div class="divRegister">
        <p>No tienes cuenta?</p>
        <router-link :to="'/register'" class="link">Crear cuenta</router-link>
      </div>
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
  padding: 2.5rem 2rem 1rem 2rem;
}

.login-card h2 {
  font-size: 2em;
  font-weight: bold;
  margin: 0 0 1rem 0;
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

.btn-login {
  margin: 2vh 0;
}

.divRegister {
  display: flex;
  justify-content: space-between;
  margin-top: 1vh;
  p {
    margin: 0;
    font-size: 1.1em;
  }
  .link {
    color: black;
    text-decoration: none;
    font-size: 1.1em;
  }
  .link:hover {
    color: #8a6f4e;
    text-decoration: underline;
  }
}

input {
  width: 100%;
  color: #8a6f4e;
  background: #fff;
  border: 1px solid #000;
}

input.error {
  border-color: #ff122e;
}

.divForm {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.divFormField {
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
}
:deep(.custom-password) {
  width: 100%;
}

:deep(.custom-password .p-password-input) {
  width: 100%;
  background: #fff;
  color: #8a6f4e;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 10px 40px 10px 12px;
}

:deep(.custom-password .p-password-input:focus) {
  border-color: #8a6f4e;
  box-shadow: none;
}

:deep(.custom-password .p-password-toggle-mask-icon) {
  color: #8a6f4e;
  right: 12px;
}
</style>