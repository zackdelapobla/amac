<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })
const { listSpecies, deleteSpecies } = useSpecies()
const { success, error, withToast } = useToast()

const q = ref('')
const family = ref('')
const origin = ref('')
const all = ref([])
const loading = ref(true)

onMounted(async () => {
  all.value = await listSpecies() // trae todas
  loading.value = false
})

const norm = (s='') => s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
const families = computed(()=>Array.from(new Set(all.value.map(s=>s.family).filter(Boolean))).sort())
const origins = computed(()=>Array.from(new Set(all.value.map(s=>s.origin).filter(Boolean))).sort())

const filtered = computed(() => {
  const k = norm(q.value)
  return all.value.filter(sp => {
    const mText = !k || norm(sp.commonName).includes(k) || norm(sp.scientificName).includes(k) || norm(sp.family||'').includes(k)
    const mFam = !family.value || sp.family === family.value
    const mOri = !origin.value || sp.origin === origin.value
    return mText && mFam && mOri
  })
})

const remove = async (id) => {
  if (!confirm('¿Eliminar especie?')) return
  try {
    await withToast(deleteSpecies(id), {
      loading: 'Eliminando…',
      ok: 'Especie eliminada',
      fail: 'No se pudo eliminar'
    })
    all.value = all.value.filter(s => (s.id || s.specie_id) !== id)
  } catch (e) {
    error(e?.data?.message || 'Error al eliminar')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Especies</h2>
      <NuxtLink to="/admin/species/new" class="px-3 py-2 rounded bg-emerald-600 text-white">Nueva especie</NuxtLink>
    </div>

    <div class="grid sm:grid-cols-3 gap-3">
      <input v-model="q" placeholder="Buscar..." class="px-3 py-2 border rounded-lg" />
      <select v-model="family" class="px-3 py-2 border rounded-lg">
        <option value="">Todas las familias</option>
        <option v-for="f in families" :key="f" :value="f">{{ f }}</option>
      </select>
      <select v-model="origin" class="px-3 py-2 border rounded-lg">
        <option value="">Todos los orígenes</option>
        <option v-for="o in origins" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>

    <div v-if="loading">Cargando…</div>
    <div v-else class="overflow-x-auto rounded-lg border bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="text-left p-3">Nombre común</th>
            <th class="text-left p-3">Nombre científico</th>
            <th class="text-left p-3">Familia</th>
            <th class="text-left p-3">Origen</th>
            <th class="text-right p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sp in filtered" :key="sp.id || sp.specie_id" class="border-t">
            <td class="p-3">{{ sp.commonName }}</td>
            <td class="p-3 italic">{{ sp.scientificName }}</td>
            <td class="p-3">{{ sp.family || '—' }}</td>
            <td class="p-3">{{ sp.origin || '—' }}</td>
            <td class="p-3 text-right">
              <NuxtLink :to="`/admin/species/${sp.id || sp.specie_id}`" class="px-2 py-1 text-emerald-700">Editar</NuxtLink>
              <button @click="remove(sp.id || sp.specie_id)" class="px-2 py-1 text-red-600">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td class="p-3 text-slate-500" colspan="5">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
