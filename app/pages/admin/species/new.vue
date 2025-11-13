<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })
const { createSpecies } = useSpecies()
const router = useRouter()
const { success, error, withToast } = useToast()

const model = ref({})
const saving = ref(false)

const save = async () => {
  saving.value = true
  try {
    await withToast(createSpecies(model.value), {
      loading: 'Creando especie…',
      ok: 'Especie creada con éxito',
      fail: 'No se pudo crear la especie'
    })
    router.push('/admin/species')
  } catch (e) {
    error(e?.data?.message || 'Error al crear la especie')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Nueva especie</h2>
    <AdminSpecieForm v-model="model" :submit-label="saving ? 'Guardando…' : 'Guardar'" @submit="save" />
  </div>
</template>
