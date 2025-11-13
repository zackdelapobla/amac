<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <ToastHost />
    <header class="h-14 border-b bg-white flex items-center justify-between px-4">
      <h1 class="font-bold">Panel AMAC</h1>
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="text-sm text-emerald-700 hover:underline">Ver sitio</NuxtLink>
        <button @click="logout" class="text-sm px-3 py-1 rounded bg-slate-900 text-white">Salir</button>
      </div>
    </header>

    <div class="grid grid-cols-12">
      <!-- Sidebar -->
      <aside class="col-span-12 md:col-span-2 bg-white border-r p-3 space-y-2">
        <NuxtLink to="/admin" class="block px-3 py-2 rounded hover:bg-slate-100">Resumen</NuxtLink>
        <NuxtLink to="/admin/species" class="block px-3 py-2 rounded hover:bg-slate-100">Especies</NuxtLink>
        <NuxtLink to="/admin/projects" class="block px-3 py-2 rounded hover:bg-slate-100">Proyectos</NuxtLink>
      </aside>

      <!-- Content -->
      <main class="col-span-12 md:col-span-10 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { logout } = useApi()
</script>
