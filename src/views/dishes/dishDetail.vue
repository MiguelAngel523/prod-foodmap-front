<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import platsService from '@/services/PlatsService.js'
import router from '@/router/index.js'
import Rating from 'primevue/rating'
import Galleria from 'primevue/galleria'
import { useAuthStore } from '@/stores/auth.js'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

// LOGICA DEL PUNTUAR UN PLATO

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToast } from 'primevue/usetoast'
import { z } from 'zod'
import Message from 'primevue/message'
import { Form } from '@primevue/forms'
import ValoracioService from '@/services/ValoracioService.js'
import valoracioService from '@/services/ValoracioService.js'

const auth = useAuthStore()
const toast = useToast()
const initialValues = ref({
  rating: null,
})

const resolver = zodResolver(
  z.object({
    rating: z
      .number({ message: 'Rating is required.' })
      .nullable()
      .refine((value) => value !== null, {
        message: 'Rating is required.',
      }),
    comentari: z
      .string()
      .max(100, { message: 'El comentario no puede superar los 100 caracteres.' })
      .optional(),
  }),
)

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    await ValoracioService.doValoracio(
      auth.user.id,
      plato.value.id,
      values.rating,
      values.comentari ?? null, // ← añades el comentari
    )
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Rating submitted: ${values.rating}`,
      life: 3000,
    })
  }
  visible.value = false;
}

// LOGICA DE PAGINA
const route = useRoute()
const plato = ref(null)
const rating = ref(4.5)
const avg = ref(0)
const visible = ref(false)
const visibleComents = ref(false)
const coments = ref([])
const resumen = ref(null)

const getPuntuacioPlat = (plat) => {
  let num = 0
  if (plat.valoracions) {
    plat.valoracions.forEach((x) => {
      num = num + x.puntuacio
    })
    console.log(plat.valoracions)
    coments.value = plat.valoracions
    rating.value = num / plat.valoracions.length
    avg.value = plat.valoracions.length
  }
}

defineEmits(['add'])

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

async function getPlat(id) {
  const result = await platsService.getPlat(id)
  plato.value = result.data
  getPuntuacioPlat(plato.value)
}

const imagenes = computed(() =>
  plato.value.carrusel.map((url) => ({ itemImageSrc: url, thumbnailImageSrc: url })),
)

function volver() {
  router.push('/dishes')
}

async function openRating() {
  visibleComents.value = true
  const resp = await valoracioService.getResum(route.params.id)
  resumen.value = resp.data
  console.log(resumen.value)
}

onMounted(() => {
  const id = route.params.id
  getPlat(id)
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <button @click="volver()" class="btnCard botons">← Volver</button>
      <p>Ingredientes frescos · Cocina de temporada</p>
    </div>
    <div class="dish-card" v-if="plato">
      <div class="dish-image">
        <Galleria
          :value="imagenes"
          :numVisible="5"
          :circular="true"
          :showItemNavigators="true"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <img
              :src="`/img/${slotProps.item.itemImageSrc}`"
              :alt="slotProps.item.thumbnailImageSrc"
              style="height: 100vh; object-fit: cover"
            />
          </template>
        </Galleria>
        <div class="badge">Plato del día</div>
      </div>
      <div class="dish-info">
        <div>
          <div class="dish-category">Primeros platos</div>
          <div class="dish-name">{{ plato.nom }}</div>
          <p class="dish-desc">
            {{ plato.descripcio }}
          </p>
        </div>
        <div>
          <div class="dish-meta">
            <div>
              <div class="dish-tags" style="margin-top: 10px">
                <span class="tag">Delicioso</span>
              </div>
              <div class="divRating">
                <Rating v-model="rating" readonly @click="openRating" />
                <p>({{ avg }})</p>
              </div>
            </div>
            <div class="dish-price">{{ formatPrice(plato.preu) }}</div>
          </div>
          <div class="divPuntuar">
            <button class="btnCard botons" @click="visible = true">Puntúalo</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900"
      style="
        background-color: #ffffff;
        border-radius: 20px;
        box-shadow: 0 4px 13px -3px rgba(0, 0, 0, 0.75);
        overflow: hidden;
      "
      v-else
    >
      <div class="flex mb-4">
        <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
        <div>
          <Skeleton width="10rem" class="mb-2"></Skeleton>
          <Skeleton width="5rem" class="mb-2"></Skeleton>
          <Skeleton height=".5rem"></Skeleton>
        </div>
      </div>
      <Skeleton width="100%" height="20vh"></Skeleton>
      <div class="flex justify-between mt-4">
        <Skeleton width="4rem" height="2rem"></Skeleton>
        <Skeleton width="4rem" height="2rem"></Skeleton>
      </div>
      <Skeleton width="100%" height="20vh"></Skeleton>
      <div>
        <Skeleton width="10rem" class="mb-2"></Skeleton>
        <Skeleton width="5rem" class="mb-2"></Skeleton>
        <Skeleton height=".5rem"></Skeleton>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '45vw', backgroundColor: '#f0f0f0', borderRadius: '10px' }"
  >
    <div class="divContentModal">
      <div v-if="auth.isAuthenticated">
        <div class="formRating">
          <Form
            v-slot="$form"
            :resolver="resolver"
            :initialValues="initialValues"
            @submit="onFormSubmit"
          >
            <div class="divRatingForm">
              <h2>Puntuar plato</h2>
              <Rating name="rating" />
              <Message v-if="$form.rating?.invalid" severity="error" size="small" variant="simple">
                {{ $form.rating.error?.message }}
              </Message>
              <Textarea
                name="comentari"
                placeholder="Escriu el teu comentari..."
                rows="3"
                style="width: 100%"
              />
              <Message
                v-if="$form.comentari?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.comentari.error?.message }}
              </Message>
              <Button type="submit" class="btnCard botons" label="Submit" />
            </div>
          </Form>
        </div>
      </div>
      <div class="noLoggued" v-else>
        <p>No estás loggeado, Nesecitas iniciar sesion</p>
        <router-link :to="'/login'" class="btnCard botons">Iniciar sesion</router-link>
      </div>
    </div>
  </Dialog>
  <Dialog
    v-model:visible="visibleComents"
    :modal="true"
    :style="{ width: '50vw', backgroundColor: '#f0f0f0', borderRadius: '10px' }"
  >
    <div class="divContentModal dialogComents">
      <div>
        <div class="resumReseñas">
          <h3>Resumen reseñas</h3>
          <p v-if="resumen">
            {{ resumen.resum }}
          </p>
          <div v-else>
            <Skeleton width="100%" height="2vh" class="mb-2"></Skeleton>
            <Skeleton width="100%" height="2vh" class="mb-2"></Skeleton>
            <Skeleton width="100%" height="2vh" class="mb-2"></Skeleton>
            <Skeleton width="100%" height="2vh" class="mb-2"></Skeleton>
            <Skeleton width="90%" height="2vh" class="mb-2"></Skeleton>
          </div>
        </div>
        <h2 id="titolComentarios">Comentarios</h2>
        <div v-for="coment in coments" class="divComent">
          <div class="divComentUser">
            <p>{{ coment.nomUsuari }}</p>
            <Rating v-model="coment.puntuacio" readonly></Rating>
          </div>
          <div class="divComentari">
            <p>{{ coment.comentari }}</p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.page {
  margin: 2vh 10vw;
  padding: 2rem 1rem;
}
.page-header {
  margin-bottom: 2rem;
}
.page-header p {
  font-size: 14px;
  color: #000;
  margin-top: 4px;
}
.dish-card {
  background-color: #fcfcfc;
  box-shadow: 0 4px 13px -3px rgba(0, 0, 0, 0.75);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 300px;
}
.dish-image {
  position: relative;
  overflow: hidden;
  background: #f5ede0;
}
.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.dish-image .badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #000;
  letter-spacing: 0.3px;
}
.dish-info {
  padding: 1.5rem 2rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.dish-category {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #b85c2c;
  margin-bottom: 8px;
}
.dish-name {
  font-size: 2.5em;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 10px;
}
.dish-name em {
  font-style: italic;
  font-weight: 400;
}
.dish-desc {
  font-size: 1.2em;
  line-height: 1.7;
  flex: 1;
}
.dish-meta {
  border-top: 0.5px solid #3c2714;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dish-price {
  font-size: 3em;
  font-weight: 500;
  color: #3c2714;
}
.dish-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  font-size: 1em;
  padding: 3px 8px;
  border-radius: 20px;
  border: 0.5px solid #3c2714;
  color: #3c2714;
}
.divRating {
  display: flex;
  margin: 2vh 0;
  --p-rating-icon-size: 1.1em;
  p {
    margin: 0 0.5vw;
    font-size: 1.1em;
  }
}
.botons {
  margin: 2vh 0;
  padding: 1vh 1.5vw;
  font-size: 1.2em;
}
.divPuntuar {
  display: flex;
  justify-content: center;
}

:deep(.p-dialog-mask) {
  background: rgba(0, 0, 0, 0.5) !important;
}

.formRating {
  display: flex;
  justify-content: center;
}

.noLoggued {
  text-align: center;
  p {
    color: black;
    font-size: 1.3em;
    font-weight: 500;
    margin: 0 0 2vh 0;
  }
}

.divRatingForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.3vh;
  --p-rating-icon-size: 1.5em;
  h2 {
    font-size: 2.2em;
    font-weight: bold;
    color: #3c2714;
  }
}

.resumReseñas {
  border: solid 2px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 1rem;
  h3 {
    font-size: 1.1em;
    font-weight: bold;
    color: #3c2714;
  }
  p {
    font-size: 1em;
    color: #393939;
    margin: 0;
  }
}

.divComent {
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 7px;
  padding: 1rem;
  margin: 1vh 0;
}

.divComentUser {
  display: flex;
  color: black;
  gap: 1vw;
  margin: 0 0 1vh 0;
  p {
    font-weight: bold;
    margin: 0;
  }
}

.divComentari {
  color: #272727;
  p {
    margin: 0;
  }
}

#titolComentarios {
  font-size: 1.5em;
  font-weight: 800;
  color: #3c2714;
  margin: 3vh 0 2vh 0;
}

.dialogComents{
  overflow: scroll;
}

:deep(.p-skeleton) {
  --p-skeleton-background: #cbd5e1;
  --p-skeleton-animation-background: #e2e8f0;
}

:deep(.p-textarea) {
  --p-textarea-background: #fff;
  --p-textarea-placeholder-color: #a8a8a8;
  --p-textarea-color: #151515;
}
</style>
