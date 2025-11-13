<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const { getSpeciesById, updateSpecies } = useSpecies()
const { success, error, withToast } = useToast()

const model = ref(null)
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  try {
    model.value = await getSpeciesById(route.params.id)
  } catch (e) {
    error('No se pudo cargar la especie')
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  try {
    await withToast(updateSpecies(route.params.id, model.value), {
      loading: 'Guardando cambios…',
      ok: 'Cambios guardados',
      fail: 'No se pudo guardar'
    })
    router.push('/admin/species')
  } catch (e) {
    error(e?.data?.message || 'Error al guardar')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Editar especie</h2>
    <div v-if="loading">Cargando…</div>
    <AdminSpecieForm v-else v-model="model" :submit-label="saving ? 'Guardando…' : 'Guardar cambios'" @submit="save" />
  </div>
</template>
