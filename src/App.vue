<script setup>
import NavComponent from '@/core/nav/navComponent.vue'
import FooterComponent from '@/core/footer/footerComponent.vue'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'primeflex/primeflex.css'
import '@fontsource/dancing-script'
import Toast from 'primevue/toast'
</script>

<template>
  <Toast/>
  <nav-component></nav-component>
  <router-view></router-view>
  <footer-component></footer-component>
</template>

<style>
:root {
  --p-stepper-step-number-background: #d7f595;
  --p-stepper-step-number-active-background: #3c2714;
  --p-stepper-step-number-active-color: #fff;
  --p-stepper-step-number-color: #000;
  --p-stepper-steppanel-color: #078900;
  --p-stepper-step-title-color: #000;
  --p-stepper-separator-active-background: #d7f595;
  --p-stepper-step-title-active-color: #3c2714;
  --p-stepper-steppanel-background: #fff;
}

* {
  font-family: 'Inter', sans-serif;
}
body {
  background-color: #fdf8ee;
  margin: 0;
}

.btnCard {
  padding: 1vh 2.5vw;
  background-color: #d7f595;
  color: #3c2714;
  border: solid #3c2714;
  border-radius: 1em;
  margin-top: 5vh;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btnCard:hover {
  background-color: #3c2714;
  color: #d7f595;
  border: solid #d7f595;
}

.p-toast-message-error .p-toast-summary,
.p-toast-message-error .p-toast-detail {
  color: #000 !important;
}
</style>
