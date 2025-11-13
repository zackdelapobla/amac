<script setup>
import { ref, computed, onMounted, watch } from 'vue'
const router = useRouter()
const route = useRoute()
const { listSpecies } = useSpecies()

// Estado
const q = ref(route.query.q || '')
const family = ref(route.query.family || '')
const origin = ref(route.query.origin || '')

const all = ref([])
const loading = ref(true)
const error = ref(null)

// Cargar TODO una vez
onMounted(async () => {
    try {
        all.value = await listSpecies() // trae todas las especies (sin paginación)
    } catch (e) {
        error.value = 'Error cargando especies'
        console.error(e)
    } finally {
        loading.value = false
    }
})

// Normalizador (sin tildes y minúsculas)
const norm = (s = '') =>
    s.toString()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim()

// Opciones únicas de filtros (derivadas de la data)
const families = computed(() => {
    const set = new Set(all.value.map(sp => sp.family).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
})
const origins = computed(() => {
    const set = new Set(all.value.map(sp => sp.origin).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
})

// Filtrado en memoria
const filtered = computed(() => {
    const k = norm(q.value)
    return all.value.filter(sp => {
        // Texto
        const matchesText = !k || norm(sp.commonName).includes(k)
            || norm(sp.scientificName).includes(k)
            || norm(sp.family || '').includes(k)

        // Familia
        const matchesFamily = !family.value || sp.family === family.value

        // Origen
        const matchesOrigin = !origin.value || sp.origin === origin.value

        return matchesText && matchesFamily && matchesOrigin
    })
})

// Sincronizar filtros en la URL (debounced)
let t
watch([q, family, origin], ([qv, fv, ov]) => {
    clearTimeout(t)
    t = setTimeout(() => {
        router.replace({
            query: {
                q: qv || undefined,
                family: fv || undefined,
                origin: ov || undefined
            }
        })
    }, 250)
})
</script>

<template>
    <section class="bg-gradient-to-b from-emerald-900/20 to-slate-950 min-h-screen">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-24">
            <!-- Encabezado -->
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 class="text-4xl text-white sm:text-5xl font-extrabold tracking-tight">Flora nativa</h1>
                    <p class="mt-3 text-slate-300 max-w-2xl">
                        Explora especies representativas de la zona. Busca por nombre común, científico o filtra por
                        familia y origen.
                    </p>
                </div>
            </div>

            <!-- Controles -->
            <div class="mt-8 grid gap-4 md:grid-cols-3">
                <input v-model="q" type="text" placeholder="Buscar especies…"
                    class="px-4 py-2 rounded-lg bg-white/90 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 w-full" />

                <!-- Select Familia -->
                <select v-model="family"
                    class="px-4 py-2 rounded-lg bg-white/90 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 w-full">
                    <option value="">Todas las familias</option>
                    <option v-for="f in families" :key="f" :value="f">{{ f }}</option>
                </select>

                <!-- Select Origen -->
                <select v-model="origin"
                    class="px-4 py-2 rounded-lg bg-white/90 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 w-full">
                    <option value="">Todos los orígenes</option>
                    <option v-for="o in origins" :key="o" :value="o">{{ o }}</option>
                </select>
            </div>

            <!-- Chips activos -->
            <div class="mt-4 flex flex-wrap gap-2">
                <button v-if="q" @click="q = ''"
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm">
                    “{{ q }}” <span class="text-slate-300">✕</span>
                </button>
                <button v-if="family" @click="family = ''"
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-100 border border-emerald-600/30 hover:bg-emerald-600/30 text-sm">
                    Familia: <strong>{{ family }}</strong> <span class="text-emerald-200">✕</span>
                </button>
                <button v-if="origin" @click="origin = ''"
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-600/20 text-sky-100 border border-sky-600/30 hover:bg-sky-600/30 text-sm">
                    Origen: <strong>{{ origin }}</strong> <span class="text-sky-200">✕</span>
                </button>

                <button v-if="q || family || origin" @click="q = ''; family = ''; origin = '';"
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm">
                    Limpiar filtros
                </button>
            </div>

            <!-- Contenido -->
            <div class="mt-10">
                <div v-if="loading" class="text-slate-300">Cargando especies…</div>
                <div v-else-if="error" class="text-red-400">{{ error }}</div>
                <div v-else-if="!filtered.length" class="text-slate-400">No se encontraron especies.</div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <NuxtLink v-for="sp in filtered" :key="sp.id || sp.specie_id || sp.slug" :to="`/flora/${sp.slug}`"
                        class="group bg-gray-300 rounded-xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition-all">
                        <img :src="sp.imageUrl || '/placeholder.jpg'" :alt="sp.commonName"
                            class="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy" />
                        <div class="p-4">
                            <h3 class="text-lg font-bold text-emerald-900 group-hover:text-emerald-700">
                                {{ sp.commonName }}
                            </h3>
                            <p class="text-sm italic text-slate-600">{{ sp.scientificName }}</p>
                            <div class="mt-2 flex flex-wrap gap-2">
                                <span v-if="sp.family"
                                    class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                                    {{ sp.family }}
                                </span>
                                <span v-if="sp.origin"
                                    class="px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-xs border border-sky-200">
                                    {{ sp.origin }}
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>
