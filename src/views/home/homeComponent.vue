<script setup>
import { nextTick, onMounted, onUnmounted } from 'vue'
import AiDishes from '@/core/ai-dishes/AiDishes.vue'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// ANIMACIÓN DEL AVIÓN

gsap.registerPlugin(MotionPathPlugin)

const animateFlight = (path, plane) => {
  const length = path.getTotalLength()

  gsap.set(path, {
    strokeDasharray: '10 8',
    strokeDashoffset: length,
  })

  gsap.set(plane, {
    x: -100,
    opacity: 0,
  })

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 })

  tl.to(plane, {
    opacity: 1,
    duration: 0.1,
    ease: 'none',
  })

  tl.to(
    path,
    {
      strokeDashoffset: 0,
      duration: 40,
      ease: 'none',
    },
    '<',
  )

  tl.to(
    plane,
    {
      motionPath: {
        path: '#flight-path',
        align: '#flight-path',
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
      duration: 40,
      ease: 'none',
    },
    '<',
  )

  tl.to(plane, {
    x: '+=100',
    opacity: 0,
    duration: 0.1,
    ease: 'power2.in',
  })

  tl.eventCallback('onRepeat', () => {
    gsap.set(path, { strokeDashoffset: length })
    gsap.set(plane, { x: -100, opacity: 0 })
  })
}

// ANIMACIÓN CHIVA

let tl

const animateChiva = (chiva) => {
  gsap.set(chiva, { scaleX: 1 })

  tl = gsap.timeline({ repeat: -1 })
  tl.to(chiva, {
    motionPath: {
      path: '#roadTop',
      align: '#roadTop',
      autoRotate: true,
      alignOrigin: [0, 1],
      start: 1,
      end: 0,
    },
    duration: 15,
    ease: 'none',
    onStart: () => gsap.set(chiva, { scaleX: -1, scaleY: 1 }),
  })

  tl.to(chiva, {
    motionPath: {
      path: '#roadTop',
      align: '#roadTop',
      autoRotate: true,
      alignOrigin: [0.5, 1],
      start: 0,
      end: 1,
    },
    duration: 15,
    ease: 'none',
    onStart: () => gsap.set(chiva, { scaleX: -1, scaleY: -1 }),
  })
}

onUnmounted(() => {
  if (tl) {
    tl.kill()
    tl = null
  }
})

onMounted(async () => {
  await nextTick()
  const path = document.querySelector('#flight-path')
  const plane = document.querySelector('#plane')
  const chiva = document.querySelector('#chiva')
  const roadTop = document.querySelector('#roadTop')

  if (path && chiva && roadTop) {
    animateFlight(path, plane)
    animateChiva(chiva)
  }
})
</script>

<template>
  <div>
    <div id="carouselExampleFade" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="4000">
          <img src="@/assets/img/arepas_banner.jpg" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item" data-bs-interval="4000">
          <img src="@/assets/img/empanadas_banner.jpg" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item" data-bs-interval="4000">
          <img src="@/assets/img/sushi_banner.jpg" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item" data-bs-interval="4000">
          <img src="@/assets/img/bandeja_banner.jpg" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item" data-bs-interval="4000">
          <img src="@/assets/img/comida_rumana_banner.jpg" class="d-block w-100" alt="..." />
        </div>
      </div>
    </div>
  </div>

  <div class="divChiva">
    <svg
      id="road-svg"
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 680 87"
      preserveAspectRatio="xMidYMid meet"
      style="overflow: visible"
    >
      <g transform="translate(0, 87) scale(0.1, -0.1)">
        <path
          id="roadTop"
          d="M -655,337
           l 1300,8
           c 692,9 1132,1 1590,-29
           c 271,-18 376,-13 505,21
           c 33,9 94,22 135,30
           c 131,23 295,14 510,-29
           c 158,-32 300,-37 1620,-47
           c 1382,-11 1513,-9 1980,27
           c 227,17 553,24 583,12"
          fill="none"
          stroke="transparent"
        />
        <image id="chiva" href="/src/assets/img/chiva.png" width="50" height="50" x="0" y="-4" />
      </g>
      <g transform="translate(0, 87) scale(0.1, -0.1)" fill="#3c2714" stroke="none">
        <path
          d="M2875 345 c-41 -8 -102 -21 -135 -30 -129 -34 -244 -39 -505 -21
        -458 30 -898 38 -1590 29 l-655 -8 -3 -157 -3 -158 3801 0 3800 0 0 150 c0
        134 -2 151 -17 158 -30 12 -356 5 -583 -12 -467 -36 -598 -38 -1980 -27 -1320
        10 -1462 15 -1620 47 -215 43 -379 52 -510 29z"
        />
      </g>
    </svg>
  </div>
  <div id="divCarta" class="divPadding">
    <div class="card mb-3 rounded-4 shadow">
      <div class="row g-0" style="border-radius: 20px">
        <div class="col-md-6">
          <img src="@/assets/img/cena.jpg" class="imgCard rounded-start-4" alt="..." />
        </div>
        <div class="col-md-6">
          <div class="card-body">
            <h5 class="card-title">Explora nuestra carta</h5>
            <p class="card-text">
              Entra y explora por la gran variedad cultural que hay en nuestro menú
            </p>
            <RouterLink to="/dishes" class="btnCard">Ver carta</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="divPaddingIa">
    <h2 data-aos="zoom-in" data-aos-offset="1200">Indeciso?</h2>
    <p data-aos="zoom-in" data-aos-offset="1300">
      Deja que nosotros te mostremos las mejores opciones en base a tus preferencias
    </p>
    <AiDishes></AiDishes>
  </div>
  <div class="flight-container">
    <svg width="100%" viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
      <path
        id="flight-path"
        d="M -100,150
        C 20,150 60,115 120,130
        C 165,142 168,88 215,82
        C 264,74  297,88  280,118
        C 252,148 195,118 222,88
        C 252,58  300,65  325,100
        C 358,128 392,148 452,132
        C 478,118 482,78  528,70
        C 567,60  612,78  590,110
        C 565,142 500,112 525,80
        C 552,50  612,58  625,95
        C 652,128 682,148 780,145"
        fill="none"
        stroke="#1a1a1a"
        stroke-width="3"
        stroke-dasharray="10 8"
        stroke-linecap="round"
      />
      <g
        id="plane"
        transform="translate(0.000000,160.000000) scale(0.05,-0.05)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M547 1593 c-4 -3 -7 -94 -7 -202 0 -108 -3 -206 -7 -219 -3 -13 -16
        -28 -29 -33 -31 -11 -30 -27 1 -39 50 -19 52 -91 5 -115 -31 -16 -172 -41
        -290 -51 l-75 -6 -19 62 c-10 33 -28 75 -40 93 -28 41 -59 43 -66 3 -7 -41 5
        -259 21 -361 21 -144 42 -146 94 -9 l34 89 169 0 c127 0 176 -4 196 -14 31
        -17 34 -47 10 -93 -15 -28 -15 -34 -1 -57 22 -39 27 -73 47 -307 11 -133 16
        -154 35 -154 26 0 63 137 105 387 l11 71 59 7 c95 11 106 45 18 59 -22 4 -50
        17 -64 31 -28 28 -32 70 -7 79 9 4 78 11 152 17 75 5 160 16 189 24 105 27
        131 69 59 92 -61 20 -84 23 -232 28 -167 6 -182 9 -190 36 -10 32 19 66 77 87
        29 11 53 25 53 32 0 7 -29 23 -65 34 -80 26 -86 36 -138 216 -50 174 -81 237
        -105 213z"
        />
      </g>
    </svg>
  </div>

  <div class="p-5">
    <h3 class="text-center fs-1 fw-bold mt-3">Sobre nosotros</h3>
    <div class="row d-flex justify-content-center">
      <div class="col-12 col-md-4 p-0 card rounded-4 mx-3 mt-4 entradas" id="entrada1">
        <img src="@/assets/img/patatas.jpg" class="card-img-top" alt="..." />
        <div class="card-body pb-4">
          <h5 class="my-2 text-start mx-1">Nuestras patatas caseras</h5>
          <p class="card-text text-start mx-1 p-0 mb-4">
            Tenemos patatas naturales de calidad, preparadas al momento para el disfrute del cliente
          </p>
          <a href="#" class="btnCard">Ver más</a>
        </div>
      </div>
      <div class="col-12 col-md-4 p-0 card rounded-4 mx-3 mt-4 entradas" id="entrada2">
        <img src="@/assets/img/michelada.jpg" class="card-img-top" alt="..." />
        <div class="card-body pb-4">
          <h5 class="my-2 text-start mx-1">Cócteles exoticos</h5>
          <p class="card-text text-start mx-1 p-0 mb-4">
            Tenemos una gran variedad de cócteles de diferentes culturas.
          </p>
          <a href="#" class="btnCard">Ver más</a>
        </div>
      </div>
      <div class="col-12 col-md-4 p-0 card rounded-4 mx-3 mt-4 entradas" id="entrada3">
        <img
          src="@/assets/img/pexels-jiri-ikonomidis-164966727-32651700.jpg"
          class="card-img-top"
          alt="..."
        />
        <div class="card-body pb-4">
          <h5 class="my-2 text-start mx-1">Nuestro proveedores</h5>
          <p class="card-text text-start mx-1 p-0 mb-4">
            Contamos con proveedores los cuales nos brindan productos de calidad
          </p>
          <a href="#" class="btnCard">Ver más</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divPadding {
  padding: 5vh 20vw;
}

.divPaddingIa {
  padding: 10vh 20vw 0 20vw;
  text-align: center;
  h2 {
    font-size: 2.5em;
    font-weight: bold;
    color: #3c2714;
  }
  p {
    font-size: 1em;
    font-weight: normal;
    margin: 2vh 0;
  }
}

#divCarta {
  background-color: #3c2714;
}

.card-body {
  text-align: center;
}

.card-body h5 {
  font-size: 2.5em;
  color: #3c2714;
  margin: 5vh 0;
}

.card-body p {
  font-size: 1.2em;
  color: #3c2714;
  margin: 2vh 0;
  padding: 2vh 5vw;
  font-weight: 700;
}

.imgCard {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.entradas > img {
  height: 35vh;
}

#chiva {
  width: auto;
  height: 20vw;
}

.divChiva {
  overflow: hidden;
}

#entrada1,
#entrada2,
#entrada3 {
  width: 23rem;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

#entrada1:hover,
#entrada2:hover,
#entrada3:hover {
  transform: scale(1.04);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.flight-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

@media (max-width: 1200px) {
  .divChiva {
    display: none;
  }
}
</style>
