<!-- /pages/flora/[slug].vue -->
<script setup>
const route = useRoute()
const { getSpeciesBySlug } = useSpecies()
const { listImages } = useSpeciesImages()

// 1) Cargar especie
const { data: sp, pending, error } = await useAsyncData(
  () => `species-${route.params.slug}`,
  () => getSpeciesBySlug(String(route.params.slug)),
  { server: true }
)

// 2) Cargar imágenes asociadas (galería)
const { data: images } = await useAsyncData(
  () => `species-images-${route.params.slug}`,
  async () => {
    // hasta que no haya especie no sabemos el ID
    if (!sp.value) return []
    const id = sp.value.id ?? sp.value.specie_id
    if (!id) return []
    return await listImages(id)
  },
  { server: true }
)

// 3) Imagen principal: priorizar
// - sp.imageUrl (campo clásico)
// - imagen marcada como isPrimary
// - primera imagen de la galería
// - fallback a placeholder
const mainImage = computed(() => {
  if (sp.value?.imageUrl) return sp.value.imageUrl
  if (images.value && images.value.length) {
    const primary = images.value.find(i => i.isPrimary)
    return primary?.url || images.value[0].url
  }
  return '/placeholder.jpg'
})

// 4) Lightbox para ver imágenes en grande
const lightboxOpen = ref(false)
const activeImage = ref(null)

const openLightbox = (img) => {
  activeImage.value = img
  lightboxOpen.value = true
}
const closeLightbox = () => {
  lightboxOpen.value = false
  activeImage.value = null
}

// 5) Metadatos SEO
useHead(() => {
  const title = sp.value?.commonName
    ? `${sp.value.commonName} — ${sp.value.scientificName} | Flora de Peralillo`
    : 'Flora de Peralillo'

  const desc = sp.value?.description
    ? (typeof sp.value.description === 'string'
        ? sp.value.description.replace(/<[^>]*>/g, '').slice(0, 160)
        : 'Especie nativa de la zona de Peralillo.')
    : 'Especie nativa de la zona de Peralillo.'

  const img = mainImage.value || '/og-flora.jpg'

  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:image', content: img },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }
})
</script>

<template>
  <section class="bg-gradient-to-b from-emerald-900/20 to-slate-950 min-h-screen">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
      <NuxtLink to="/flora" class="text-sm text-emerald-300 hover:text-emerald-200">
        ← Volver a flora
      </NuxtLink>

      <div v-if="pending" class="mt-6 text-slate-300">Cargando especie…</div>
      <div v-else-if="error" class="mt-6 text-red-400">No se pudo cargar la especie.</div>
      <div v-else-if="!sp" class="mt-6 text-slate-300">Especie no encontrada.</div>

      <div v-else class="mt-6 space-y-10">
        <!-- Cabecera: imagen principal + datos -->
        <div class="grid lg:grid-cols-2 gap-8 items-start">
          <!-- Imagen principal -->
          <div
            class="bg-white/5 rounded-2xl overflow-hidden shadow border border-white/10 cursor-pointer group"
            @click="images && images.length ? openLightbox(images.find(i => i.isPrimary) || images[0]) : null"
          >
            <img
              :src="mainImage"
              :alt="sp.commonName"
              class="w-full h-[420px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div
              v-if="images && images.length"
              class="px-4 py-2 bg-black/40 text-xs text-slate-100 flex justify-between items-center"
            >
              <span>Haz clic para ver la galería</span>
              <span class="text-emerald-200 font-medium">{{ images.length }} foto(s)</span>
            </div>
          </div>

          <!-- Texto y metadatos -->
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white">
              {{ sp.commonName }}
            </h1>
            <p class="mt-1 text-lg italic text-emerald-200">
              {{ sp.scientificName }}
            </p>

            <!-- Chips de metadatos -->
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-if="sp.family"
                class="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-200 border border-emerald-600/30 text-sm"
              >
                Familia: <strong class="font-semibold">{{ sp.family }}</strong>
              </span>
              <span
                v-if="sp.origin"
                class="px-3 py-1 rounded-full bg-sky-600/20 text-sky-200 border border-sky-600/30 text-sm"
              >
                Origen: <strong class="font-semibold">{{ sp.origin }}</strong>
              </span>
              <span
                v-if="sp.growthForm"
                class="px-3 py-1 rounded-full bg-fuchsia-600/20 text-fuchsia-200 border border-fuchsia-600/30 text-sm"
              >
                Forma: <strong class="font-semibold">{{ sp.growthForm }}</strong>
              </span>
              <span
                v-if="sp.bloom"
                class="px-3 py-1 rounded-full bg-amber-600/20 text-amber-200 border border-amber-600/30 text-sm"
              >
                Floración: <strong class="font-semibold">{{ sp.bloom }}</strong>
              </span>
            </div>

            <!-- Descripción -->
            <div class="prose prose-invert max-w-none mt-6">
              <div v-if="sp.description" v-html="sp.description"></div>
              <p v-else class="text-slate-300">
                Aún no hay descripción para esta especie.
              </p>
            </div>

            <!-- CTA -->
            <div class="mt-8 flex gap-3 flex-wrap">
              <NuxtLink
                to="/flora"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
              >
                Volver al listado
              </NuxtLink>
              <NuxtLink
                to="/contacto"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Contribuir con información
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Galería de imágenes -->
        <section v-if="images && images.length" class="space-y-4">
          <h2 class="text-lg font-semibold text-white">Galería de la especie</h2>
          <p class="text-sm text-slate-300">
            Fotografías asociadas a <span class="font-semibold">{{ sp.commonName }}</span>.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <button
              v-for="img in images"
              :key="img.image_id"
              type="button"
              class="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 group focus:outline-none focus:ring-2 focus:ring-emerald-400"
              @click="openLightbox(img)"
            >
              <img
                :src="img.url"
                :alt="img.caption || sp.commonName"
                class="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-2 pb-1 pt-4"
              >
                <p class="text-[11px] text-slate-100 truncate">
                  {{ img.caption || 'Sin título' }}
                </p>
                <p v-if="img.author" class="text-[10px] text-slate-300 truncate">
                  Foto: {{ img.author }}
                </p>
              </div>
              <span
                v-if="img.isPrimary"
                class="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] text-white"
              >
                Principal
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen && activeImage"
        class="fixed inset-0 z-[2000] bg-black/80 flex flex-col items-center justify-center px-4"
        @click.self="closeLightbox"
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-slate-100 text-2xl hover:text-white"
          @click="closeLightbox"
        >
          ✕
        </button>

        <div class="max-w-4xl w-full">
          <img
            :src="activeImage.url"
            :alt="activeImage.caption || sp.commonName"
            class="w-full max-h-[70vh] object-contain rounded-xl border border-white/20 shadow-lg"
          />
          <div class="mt-3 text-sm text-slate-100">
            <p class="font-semibold">
              {{ activeImage.caption || sp.commonName }}
            </p>
            <p v-if="activeImage.author" class="text-slate-300">
              Autor: {{ activeImage.author }}
            </p>
            <p v-if="activeImage.source" class="text-slate-400 text-xs">
              Fuente: {{ activeImage.source }}
            </p>
            <p v-if="activeImage.license" class="text-slate-400 text-xs">
              Licencia: {{ activeImage.license }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
