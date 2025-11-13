<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const isOpen = ref(false)

function toggle() { isOpen.value = !isOpen.value }
function close() { isOpen.value = false }

// Cierra el menú al cambiar de ruta
const route = useRoute()
watch(() => route.fullPath, () => { close() })

// Bloquea scroll cuando el menú móvil está abierto
function lockScroll( lock ) {
    const b = document.body
    if (lock) { b.style.overflow = 'hidden' } else { b.style.overflow = '' }
}


onMounted(() => watch(isOpen, lock => lockScroll(lock)))
onBeforeUnmount(() => lockScroll(false))



const links = [
    { to: '/', label: 'Inicio' },
    { to: '/actividades', label: 'Actividades/Proyectos' },
    { to: '/flora', label: 'Flora Nativa' },
    { to: '/contacto', label: 'Contacto' },
]

</script>

<template>
    <header class="sticky top-0 bg-slate-950/70 border-b border-yellow-400  z-50">
        <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight">
                    <span class="text-xl text-white">AMAC</span>
                </NuxtLink>
                <div class="hidden md:flex items-center gap-8">
                    <ul class="flex items-center gap-6">
                        <li v-for="l in links" :key="l.to">
                            <NuxtLink :to="l.to"
                                class="text-sm font-medium text-slate-200 hover:text-amac-green  focus:outline-none focus-visible:ring-2 focus-visible:ring-amac-green/50 rounded px-1 py-1">
                                {{ l.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <!-- Mobile button -->
                <button @click="toggle"
                    class="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-100 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amac-green/60"
                    :aria-expanded="isOpen" aria-controls="mobile-menu" aria-label="Abrir menú">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path v-if="!isOpen" d="M3 6h18M3 12h18M3 18h18" />
                        <path v-else d="M6 6l12 12M18 6l-12 12" />
                    </svg>
                </button>
            </div>
        </nav>
        <!-- Mobile panel -->
        <div v-show="isOpen" id="mobile-menu"
            class="md:hidden border-t  border-yellow-400 bg-indigo-950">
            <div class="space-y-1 px-4 py-3">
                <NuxtLink v-for="l in links" :key="l.to" :to="l.to" @click="close"
                    class="block rounded-lg px-3 py-2 text-base font-medium   dark:text-slate-100 hover:bg-slate-800">
                    {{ l.label }}
                </NuxtLink>
            </div>
        </div>
    </header>
</template>