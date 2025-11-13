<!-- /pages/flora/[slug].vue -->
<script setup>
const route = useRoute()
const { getSpeciesBySlug } = useSpecies()

const { data: sp, pending, error } = await useAsyncData(
  () => `species-${route.params.slug}`,
  () => getSpeciesBySlug(String(route.params.slug)),
  { server: true }
)

useHead(() => {
  const t = sp.value?.commonName
    ? `${sp.value.commonName} — ${sp.value.scientificName} | Flora de Peralillo`
    : 'Flora de Peralillo'
  const desc = sp.value?.description
    ? (typeof sp.value.description === 'string'
        ? sp.value.description.replace(/<[^>]*>/g, '').slice(0, 160)
        : 'Especie nativa de la zona de Peralillo.')
    : 'Especie nativa de la zona de Peralillo.'
  const img = sp.value?.imageUrl || '/og-flora.jpg'
  return {
    title: t,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: t },
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

      <div v-else class="mt-6 grid lg:grid-cols-2 gap-8 items-start">
        <!-- Imagen -->
        <div class="bg-white/5 rounded-2xl overflow-hidden shadow border border-white/10">
          <img
            :src="sp.imageUrl || '/placeholder.jpg'"
            :alt="sp.commonName"
            class="w-full h-[420px] object-cover"
          />
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
            <span v-if="sp.family" class="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-200 border border-emerald-600/30 text-sm">
              Familia: <strong class="font-semibold">{{ sp.family }}</strong>
            </span>
            <span v-if="sp.origin" class="px-3 py-1 rounded-full bg-sky-600/20 text-sky-200 border border-sky-600/30 text-sm">
              Origen: <strong class="font-semibold">{{ sp.origin }}</strong>
            </span>
            <span v-if="sp.growthForm" class="px-3 py-1 rounded-full bg-fuchsia-600/20 text-fuchsia-200 border border-fuchsia-600/30 text-sm">
              Forma: <strong class="font-semibold">{{ sp.growthForm }}</strong>
            </span>
            <span v-if="sp.bloom" class="px-3 py-1 rounded-full bg-amber-600/20 text-amber-200 border border-amber-600/30 text-sm">
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
          <div class="mt-8 flex gap-3">
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
    </div>
  </section>
</template>
