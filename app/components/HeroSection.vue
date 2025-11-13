<script setup>
import { ref, onMounted } from 'vue'

// Datos principales
const title = ref('Protejamos la flora nativa de Peralillo')
const subtitle = ref(
  'Sumemos manos para conservar nuestro patrimonio natural: participación ciudadana, educación ambiental y ciencia abierta.'
)

// Fondo (puede ser una imagen o varias)
const images = ['/hero/1.jpg', 'hero/2.jpg', 'hero/3.jpg']

// Animación de transición entre imágenes
const currentIndex = ref(0)
onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length
  }, 6000)
})
</script>

<template>
  <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
    <!-- Fondo con transición -->
    <TransitionGroup name="fade" tag="div">
      <div
        v-for="(img, index) in images"
        :key="index"
        v-show="index === currentIndex"
        class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        :style="{ backgroundImage: `url(${img})` }"
      ></div>
    </TransitionGroup>

    <!-- Overlay oscuro -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Contenido principal -->
    <div class="relative z-10 text-center px-6 max-w-3xl">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
        {{ title }}
      </h1>
      <p class="text-lg sm:text-xl text-gray-200 mb-8 drop-shadow-md leading-relaxed">
        {{ subtitle }}
      </p>

      <div class="flex justify-center gap-4">
       <!--  <NuxtLink
          to="/contacto"
          class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-3 rounded-full shadow-lg transition-all duration-300"
        >
          Contribuye hoy
        </NuxtLink> -->
        <NuxtLink
          to="/flora"
          class="bg-white/90 hover:bg-white text-emerald-800 font-semibold py-3 px-3 rounded-full shadow-md transition-all duration-300"
        >
          Conoce la flora
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
