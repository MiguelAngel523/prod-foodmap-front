<script setup>

</script>

<template>
  <footer>
    <img src="@/assets/img/LogoBlanco_footer.svg" alt="">
    <div>
      <div class="divsFooter"><p>Siguenos</p></div>
      <div class="divsFooter">
        <img src="@/assets/img/logoInsta.png" class="redesSociales" alt="">
        <img src="@/assets/img/logoFacebook.png" class="redesSociales" alt="">
        <img src="@/assets/img/logoX.png" class="redesSociales" alt="">
      </div>
      <div class="divsFooter"><p>Avinguda de Montilivi, 125, 17003 Girona</p></div>
    </div>
  </footer>
</template>

<style scoped>
footer{
  background-color: #000;
  display: flex;
  background-repeat: no-repeat;
  background-size: contain;
  justify-content: space-around;
  flex-wrap: wrap;
}
footer > div {
  padding: 2vh 1vw;
}
footer > img {
  width: 35vw
}

footer > div > div > p{
  font-size: 2em;
  font-weight: 600;
  color: #fff;

}

.redesSociales{
  width: 4rem;
  margin-right: 4vw;
  margin-left: 2vw;
}

footer > div+div+div p{
  font-size: 1.5em;
  font-weight: 600;
  color: #fff;
}

.divsFooter{
  margin-bottom: 5vh;
  text-align: center;
}
</style>