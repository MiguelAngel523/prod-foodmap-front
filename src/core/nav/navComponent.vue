<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

import { RouterLink, useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const router = useRouter()
const visible = ref(false)

function toAdmin() {
  if (auth.isAdmin) {
    window.location.href = `${import.meta.env.VITE_API_URL}/admin/plat`
  }
}

function logout() {
  auth.logout()
  visible.value = false
  router.push('/')
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <nav>
    <div class="navbar">
      <img id="logo" src="@/assets/img/Logo_color.png" alt="aeiouaei" @click="goHome()" />
      <h2>FoodMap</h2>
      <div id="divLogin">
        <div v-if="auth.isAdmin">
          <button @click="toAdmin()" class="btn-logged">Admin</button>
        </div>
        <div v-if="auth.isAuthenticated">
          <button class="btn-logged" @click="visible = true">
            <i class="pi pi-user"></i>
            {{ auth.user.nom }}
          </button>
        </div>
        <RouterLink to="/login" v-else class="btnCard">
          <i class="pi pi-user"></i>
          Iniciar sesion
        </RouterLink>
      </div>
    </div>
  </nav>

  <Dialog
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '25vw', backgroundColor: '#f0f0f0', borderRadius: '10px', minWidth: '300px' }"
  >
    <div class="divContentModal">
      <div>
        <div class="divContent">
          <div>
            <p><strong>Nombre</strong></p>
            <p>
              {{ auth.user.nom }}
            </p>
          </div>
          <div>
            <p><strong>Email</strong></p>
            <p>
              {{ auth.user.email }}
            </p>
          </div>
        </div>
        <button class="btnCard botons" @click="logout()">
          <i class="pi pi-user"></i>
          logout
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
nav {
  padding: 2vh 2vw;
  background-color: #ffffff;
}

nav div h2 {
  font-size: 3.5em;
  font-weight: 700;
  color: #3c2714;
  margin: 1.7vh 0 0 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  vertical-align: center;
}

#logo {
  width: 6vw;
  min-width: 70px;
}

#divLogin label {
  display: flex;
  justify-content: space-between;
  padding: 1vh 1vw;
  background-color: #d7f595;
  color: #3c2714;
  border: solid #3c2714;
  border-radius: 1em;
  font-weight: 700;
  margin: 3vh 0 0 0;
}

#divLogin label p {
  color: #000;
  margin: 0.3vh 0 0 0.5vw;
}

#divLogin label:hover {
  background-color: #cff6fd;
}

#divLogin {
  display: flex;
  gap: 1vw;
  align-items: center;
}

.btn-logged {
  background-color: #000000;
  border: solid 1px #fff;
  border-radius: 1em;
  color: #fff;
  transition: 0.25s all ease;
  padding: 1vh 2vw;
  font-weight: 600;
}
.btn-logged:hover {
  background-color: #fff;
  color: #000;
  border: solid 1px #000;
  transform: scale(1.12);
}
.divContentModal {
  text-align: center;
  color: #000;
  font-size: 1.2em;
}

.botons {
  margin: 1.5vh 0;
}

.divContent {
  display: flex;
  justify-content: space-between;
}
</style>