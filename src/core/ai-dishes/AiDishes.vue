<script setup>
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import { onMounted, ref } from 'vue'
import { useIA } from '@/services/AiService.js'
import platsService from '@/services/PlatsService.js'
import { useRouter } from 'vue-router'

const searching = ref(false)
const done = ref(false)
const resp = ref({})
const plat = ref({})
const activeStep = ref('1')
const router = useRouter()
const cultures = ref([])
const options = ref([])

const getCultures = async () => {
  cultures.value = (await platsService.getCultures()).data
  if (cultures.value.length > 0) {
    cultures.value.forEach((x) => {
      options.value.push({ label: x.nom, value: x.nom })
    })
  }
  options.value.push({ label: 'Todas', value: 'todas' })
}

const options1 = [
  { label: 'Grande', value: 'grande' },
  { label: 'Mediana', value: 'mediana' },
  { label: 'Pequeña', value: 'pequeña' },
  { label: 'No importa', value: 'no importa' },
]

const options2 = [
  { label: 'Dulce', value: 'Dulce' },
  { label: 'Salado', value: 'Salado' },
  { label: 'Picante', value: 'Picante' },
  { label: 'No importa', value: 'no importa' },
]

const resposta = ref({})

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

resposta.value.cultura = 'LatinoAmerica'
resposta.value.porcion = 'grande'
resposta.value.sabor = 'no importa'

const probar = async () => {
  searching.value = true
  done.value = true
  resp.value = await useIA().recomendarPlato(resposta.value)
  await sleep(1500)
  plat.value = (await platsService.getPlat(resp.value.id)).data
  searching.value = false
}

const reiniciar = () => {
  activeStep.value = '1'
  done.value = false
  searching.value = false
}

const goPlat = () => {
  router.push(`/dish-detail/${plat.value.id}`)
}

onMounted(() => {
  getCultures()
})
</script>

<template>
  <div>
    <div class="card divStepper">
      <Stepper v-if="!done && !searching" v-model:value="activeStep" class="w-full max-w-xl">
        <StepList>
          <Step value="1">Cultura</Step>
          <Step value="2">Sabor</Step>
          <Step value="3">Tamaño</Step>
        </StepList>

        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" value="1">
            <div class="py-4">
              <h3 class="fm-title">¿Qué cultura gastronómica te apetece?</h3>
              <SelectButton
                v-if="options.length > 0"
                :options="options"
                option-label="label"
                option-value="value"
                v-model="resposta.cultura"
                class="fm-select-btn scroll"
              />
              <div v-else class="loading loadingOptions">
                <div class="spinner-grow mb-2" style="width: 8rem; height: 8rem" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div class="flex justify-end pt-4">
              <Button
                label="Siguiente"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback('2')"
                class="btn-stepper"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="py-4">
              <h3 class="fm-title">¿Qué sabor buscas?</h3>
              <SelectButton
                :options="options2"
                option-label="label"
                option-value="value"
                v-model="resposta.sabor"
                class="scroll"
              />
            </div>
            <div class="flex justify-between pt-4">
              <Button
                label="Atrás"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback('1')"
                class="btn-stepper"
              />
              <Button
                label="Siguiente"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback('3')"
                class="btn-stepper"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" value="3">
            <div class="py-4">
              <h3 class="fm-title">¿Cuánta hambre tienes?</h3>
              <SelectButton
                :options="options1"
                option-label="label"
                option-value="value"
                v-model="resposta.porcion"
                class="fm-select-btn scroll"
              />
            </div>
            <div class="flex justify-between pt-4">
              <Button
                label="Atrás"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback('2')"
                class="btn-stepper"
              />
              <Button
                label="Buscar plato"
                icon="pi pi-search"
                iconPos="right"
                @click="probar()"
                class="btn-stepper"
              />
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
      <div v-else-if="done && searching" class="loading">
        <div class="spinner-grow mb-2" style="width: 8rem; height: 8rem" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="fm-loading-text">Buscando tu plato ideal...</p>
      </div>
      <div
        v-else-if="done && !searching"
        class="flex flex-col items-center gap-4 justify-content-center text-center py-6 max-w-sm"
      >
        <div v-if="plat.nom">
          <div class="fm-img-wrap mx-auto mb-4">
            <img :src="`/img/${plat.imatge}`" :alt="plat.nom" />
          </div>
          <span class="fm-tag">Recomendación</span>
          <h2 class="fm-result-name mt-2">{{ plat.nom }}</h2>
          <p class="fm-result-desc">{{ resp.razon }}</p>
          <Button label="Ver plato" @click="goPlat()" class="btn-stepper mt-4" />
          <Button
            label="Buscar otro plato"
            icon="pi pi-refresh"
            @click="reiniciar()"
            class="btn-stepper mt-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-stepper {
  border-radius: 20px;
  border-color: #3c2714;
  color: #000;
  background-color: #d7f595;
  margin: 0 1vw;
}
.btn-stepper:hover {
  background: #cff6fd;
}

.fm-title {
  font-size: 16px;
  font-weight: 500;
  color: #fcfcfc;
  margin-bottom: 1rem;
}
.fm-loading-text {
  font-size: 14px;
  color: #8a6f4e;
}

.fm-img-wrap {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #c8b89a;
}
.fm-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fm-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background: #eef4ea;
  color: #4a6b3d;
  font-size: 12px;
}
.fm-result-name {
  font-size: 20px;
  font-weight: 500;
}
.fm-result-desc {
  font-size: 14px;
  color: #8a6f4e;
  line-height: 1.6;
}
.divStepper {
  width: 100%;
  height: auto;
}
.loading {
  padding: 13vh 0;
  text-align: center;
}
.loadingOptions {
  padding: 1vh 0;
}
.fm-select-btn {
  background-color: #fff;
}
.scroll {
  flex-wrap: wrap;
}

:deep(.p-selectbutton .p-togglebutton) {
  --p-togglebutton-background: #fff;
  --p-togglebutton-color: #333333;
  --p-togglebutton-border-color: #fff;

  --p-togglebutton-checked-background: #fff;
  --p-togglebutton-checked-color: #ffffff;
  --p-togglebutton-checked-border-color: #fff;
  --p-togglebutton-hover-background: #fff;
  --p-togglebutton-hover-color: #8c6447;
}
</style>
