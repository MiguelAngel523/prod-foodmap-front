<script setup>
import platsService from '@/services/PlatsService.js'
import { onMounted, ref } from 'vue'
import Skeleton from 'primevue/skeleton'
import { useRouter } from 'vue-router'
import culturaService from '@/services/CulturaService.js'
import MultiSelect from 'primevue/multiselect';

const plats = ref([])
const cultures = ref([])
const router = useRouter()

const query = ref('')
const idsCultura = ref([])

async function getCultures() {
  const result = await platsService.getCultures();
  cultures.value = result.data
}

const search = async (query, culturasId) => {
  const result = await platsService.search({ query: query, idsCultura: culturasId })
  plats.value = result.data
}

const applyFilters = () => {
  plats.value = [];
  if (query.value == "" && idsCultura.value.length < 1){
    search(null, idsCultura.value);
  }
  else if (query.value.length > 0 && idsCultura.value.length < 1){
    search(query.value, null);
  }
  else {
    search(query.value, idsCultura.value)
  }
    
}

const platDetalls = (id) => {
  router.push(`/dish-detail/${id}`)
}

onMounted(() => {
  getCultures();
  search(null, null);
})
</script>

<template>
  <div class="divPage">
    <h1>Platos</h1>
    <nav class="navbar" style="background-color: #cff6fd;">
      <div class="container-fluid divSearch">
        <form class="d-flex formSearch" role="search" @submit.prevent="applyFilters">
          <MultiSelect v-model="idsCultura" :options="cultures" optionLabel="nom" filter placeholder="Seleccionar cultura"
              :maxSelectedLabels="3" class="w-full md:w-80"  optionValue="id" appendTo="self"/>
          <input class="form-control" type="search" placeholder="Nombre del plato..." v-model="query" />
          <button class="btnCard boton1" type="submit">Buscar</button>
        </form>
      </div>
    </nav>
    <div class="divList" v-if="plats.length > 0">
      <ul class="list-group">
        <li v-for="plat in plats" class="list-group-item">
          <div class="content">
            <div class="divImgProduct">
              <img :src="`/img/${plat.imatge}`" alt="as" class="imgProduct" />
            </div>
            <div class="divContent">
              <div class="divText">
                <h3>{{ plat.nom }}</h3>
                <p>{{ plat.descCurta }}</p>
              </div>
              <div class="divPreu">
                <p>{{ plat.preu }}€</p>
                <button @click="platDetalls(plat.id)" class="boton">Ver más</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="divList rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900"
      style="background-color: #ffffff"
      v-else
    >
      <ul class="m-0 p-0 list-none">
        <li class="mb-4">
          <div class="flex">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div class="self-center" style="flex: 1">
              <Skeleton width="100%" class="mb-2"></Skeleton>
              <Skeleton width="75%"></Skeleton>
            </div>
          </div>
        </li>
        <li class="mb-4">
          <div class="flex">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div class="self-center" style="flex: 1">
              <Skeleton width="100%" class="mb-2"></Skeleton>
              <Skeleton width="75%"></Skeleton>
            </div>
          </div>
        </li>
        <li class="mb-4">
          <div class="flex">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div class="self-center" style="flex: 1">
              <Skeleton width="100%" class="mb-2"></Skeleton>
              <Skeleton width="75%"></Skeleton>
            </div>
          </div>
        </li>
        <li>
          <div class="flex">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div class="self-center" style="flex: 1">
              <Skeleton width="100%" class="mb-2"></Skeleton>
              <Skeleton width="75%"></Skeleton>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.divPage {
  text-align: center;
  background-color: #cff6fd;
  padding: 5vh 0;
}
h1 {
  font-family: 'Dancing Script', cursive;
  font-size: 5em;
}

h2 {
  font-weight: bold;
}
.divList {
  margin: 0 10vw 0 10vw;
}
.content {
  display: flex;
  border-radius: 10px;
  padding: 1%;
  transition: 0.4s linear;
}
.divImgProduct {
  width: 13vw;
  height: 16vh;
  border-radius: 10px;
  overflow: hidden;
}
.imgProduct {
  width: 100%;
  transition: 0.3s linear;
}
.content:hover {
  box-shadow: 0 0 5px 1px #a8a8a8;
  .imgProduct {
    transform: scale(1.02);
  }
}
.divContent {
  width: 100%;
  display: flex;
  margin: 1vh 0 0 2vw;
  text-align: left;
}

.divText {
  width: 80%;
}
.divPreu {
  text-align: center;
  width: 20%;
}

.divContentModal > div {
  color: #000;
}

.imgModal {
  width: 100%;
  height: 60vh;
}

.divText {
  margin: 3vh 2vw;
  h3 {
    font-size: 1.7em;
    font-weight: bold;
  }
  p {
    font-size: 1.2em;
  }
}

.divContent > div + div p {
  font-size: 1.7em;
  font-weight: bold;
}

.boton {
  padding: 5%;
  background-color: #d7f595;
  font-weight: bold;
  color: #3c2714;
  border-radius: 15px;
  border: solid 1px #3c2714;
}
.boton:hover {
  background-color: #cff6fd;
}
.imgCarrusel {
  width: 40vw;
  height: 60vh;
}

:deep(.p-skeleton) {
  --p-skeleton-background: #cbd5e1;
  --p-skeleton-animation-background: #e2e8f0;
}

.boton1{
  margin: 0;
}

.divSearch {
  margin: 5vh 10vw 1vh 10vw;
  display: flex;
  justify-content: right;
  
}

.formSearch{
  gap: 1vw;
}

:deep(.p-multiselect){
  --p-multiselect-background: #fff;
  --p-multiselect-color: #000;
  --p-multiselect-option-group-background: #fff;
  --p-multiselect-overlay-background: #fff;
  --p-multiselect-option-color: #000;
  --p-checkbox-background: #fff;
}

:deep(.p-multiselect-filter) {
  background-color: #fff !important;
  color: #000 !important;
}
</style>