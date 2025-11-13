<template>
  <!-- Fondo general -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900/30 via-slate-950 to-slate-900">
    <!-- Contenedor del formulario -->
    <main
      class="w-full max-w-md mx-4 sm:mx-0 p-8 bg-white/95 rounded-2xl shadow-xl backdrop-blur-md border border-white/20"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
// Layout centrado, sin lógica
</script>

<style scoped>
/* Aparición suave */
main {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
