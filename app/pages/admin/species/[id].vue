<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getSpeciesById, updateSpecies } = useSpecies()
const { listImages, uploadImage, deleteImage, markPrimary } = useSpeciesImages()
const { success, error, withToast } = useToast()

const model = ref(null)
const loading = ref(true)
const saving = ref(false)

// imágenes
const images = ref([])
const uploading = ref(false)
const file = ref(null)
const caption = ref('')
const author = ref('')
const source = ref('')
const license = ref('CC-BY')
const isPrimary = ref(false)

onMounted(async () => {
  try {
    model.value = await getSpeciesById(route.params.id)
    images.value = await listImages(route.params.id)
  } catch (e) {
    error('No se pudo cargar la especie o la galería')
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  try {
    await withToast(updateSpecies(route.params.id, model.value), {
      loading: 'Guardando cambios…',
      ok: 'Especie actualizada'
    })
    router.push('/admin/species')
  } catch (e) {
    error(e?.data?.message || 'Error al guardar')
  } finally {
    saving.value = false
  }
}

const onFileChange = (e) => {
  const [f] = e.target.files
  file.value = f || null
}

const uploadNewImage = async () => {
  if (!file.value) {
    error('Selecciona una imagen primero')
    return
  }
  uploading.value = true
  try {
    await withToast(
      uploadImage(route.params.id, {
        file: file.value,
        caption: caption.value,
        author: author.value,
        source: source.value,
        license: license.value,
        isPrimary: isPrimary.value
      }),
      { loading: 'Subiendo imagen…', ok: 'Imagen agregada' }
    )

    // recargar lista
    images.value = await listImages(route.params.id)

    // limpiar formulario
    file.value = null
    caption.value = ''
    author.value = ''
    source.value = ''
    license.value = ''
    isPrimary.value = false
  } catch (e) {
    error(e?.data?.message || 'No se pudo subir la imagen')
  } finally {
    uploading.value = false
  }
}

const removeImage = async (image) => {
  if (!confirm('¿Eliminar esta imagen?')) return
  try {
    await withToast(deleteImage(image.image_id), {
      loading: 'Eliminando…',
      ok: 'Imagen eliminada'
    })
    images.value = images.value.filter(i => i.image_id !== image.image_id)
  } catch (e) {
    error(e?.data?.message || 'Error al eliminar imagen')
  }
}

const setPrimary = async (image) => {
  try {
    await withToast(markPrimary(image.image_id), {
      loading: 'Actualizando imagen principal…',
      ok: 'Imagen principal actualizada'
    })
    images.value = await listImages(route.params.id)
  } catch (e) {
    error(e?.data?.message || 'No se pudo actualizar la imagen principal')
  }
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-xl font-semibold mb-4">Editar especie</h2>
      <div v-if="loading">Cargando…</div>
      <AdminSpecieForm
        v-else
        v-model="model"
        :submit-label="saving ? 'Guardando…' : 'Guardar cambios'"
        @submit="save"
      />
    </div>

    <!-- Sección Galería -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Galería de imágenes</h3>

      <!-- Formulario de subida -->
      <div class="grid md:grid-cols-[2fr,3fr] gap-4 p-4 bg-white rounded-xl border">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-slate-700">Imagen</label>
          <input type="file" accept="image/*" @change="onFileChange" class="text-sm" />

          <label class="block text-sm font-medium text-slate-700">Pie de foto</label>
          <input v-model="caption" class="w-full px-3 py-2 border rounded-lg text-sm" />

          <label class="block text-sm font-medium text-slate-700">Autor</label>
          <input v-model="author" class="w-full px-3 py-2 border rounded-lg text-sm" />

          <label class="block text-sm font-medium text-slate-700">Fuente</label>
          <input v-model="source" class="w-full px-3 py-2 border rounded-lg text-sm" />

          <label class="block text-sm font-medium text-slate-700">Licencia</label>
          <input v-model="license" class="w-full px-3 py-2 border rounded-lg text-sm" />

          <label class="inline-flex items-center gap-2 mt-2 text-sm text-slate-700">
            <input type="checkbox" v-model="isPrimary" />
            Usar como imagen principal
          </label>

          <button
            type="button"
            @click="uploadNewImage"
            :disabled="uploading"
            class="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {{ uploading ? 'Subiendo…' : 'Subir imagen' }}
          </button>
        </div>

        <!-- Lista de imágenes -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="img in images"
            :key="img.image_id"
            class="relative rounded-lg overflow-hidden border bg-slate-50 group"
          >
            <img
              :src="img.url"
              class="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              :alt="img.caption || 'Imagen de especie'"
            />
            <div class="absolute top-1 left-1">
              <span
                v-if="img.isPrimary"
                class="px-2 py-0.5 text-[11px] rounded-full bg-emerald-600 text-white"
              >
                Principal
              </span>
            </div>
            <div class="p-2 space-y-1 text-xs">
              <p v-if="img.caption" class="font-medium truncate">{{ img.caption }}</p>
              <p v-if="img.author" class="text-slate-500 truncate">Autor: {{ img.author }}</p>
              <p v-if="img.license" class="text-slate-500 truncate">Licencia: {{ img.license }}</p>
              <div class="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"
                  @click="setPrimary(img)"
                  v-if="!img.isPrimary"
                >
                  Hacer principal
                </button>
                <button
                  type="button"
                  class="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200"
                  @click="removeImage(img)"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <p v-if="!images.length" class="text-sm text-slate-500 col-span-full">
            Aún no hay imágenes para esta especie.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
