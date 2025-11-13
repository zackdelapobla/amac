<script setup>
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: 'Guardar' }
})
const emit = defineEmits(['update:modelValue','submit'])

const local = reactive({
  commonName: props.modelValue.commonName || '',
  scientificName: props.modelValue.scientificName || '',
  family: props.modelValue.family || '',
  origin: props.modelValue.origin || '',
  growthForm: props.modelValue.growthForm || '',
  bloom: props.modelValue.bloom || '',
  imageUrl: props.modelValue.imageUrl || '',
  description: props.modelValue.description || ''
})

const growthOptions = [
  'árbol',
  'palmera',
  'arbusto',
  'subarbusto',
  'hierba',
  'liana',
  'trepadora',
  'cactus/suculenta',
  'helecho',
  'epífita',
  'bulbosa/geófita',
  'gramínea/pasto'
]

const originOptions = [
  'endémica',  
  'nativa',
  'introducida',
  'invasora',
]

watch(local, () => emit('update:modelValue', local), { deep: true })
const onSubmit = () => emit('submit', local)
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="grid sm:grid-cols-2 gap-3">
      <div>
        <label class="text-sm">Nombre común</label>
        <input v-model="local.commonName" class="w-full px-3 py-2 border rounded-lg" required />
      </div>

      <div>
        <label class="text-sm">Nombre científico</label>
        <input v-model="local.scientificName" class="w-full px-3 py-2 border rounded-lg italic" required />
      </div>

      <div>
        <label class="text-sm">Familia</label>
        <input v-model="local.family" class="w-full px-3 py-2 border rounded-lg" />
      </div>

      <!-- Aquí usamos el SelectField -->
      <SelectField
        v-model="local.origin"
        label="Origen"
        :options="originOptions"
        placeholder="Selecciona un origen"
      />

      <!-- Aquí usamos el SelectField -->
      <SelectField
        v-model="local.growthForm"
        label="Forma de crecimiento"
        :options="growthOptions"
        placeholder="Selecciona una forma"
      />

      <div>
        <label class="text-sm">Floración</label>
        <input v-model="local.bloom" class="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div class="sm:col-span-2">
        <label class="text-sm">Imagen (URL)</label>
        <input v-model="local.imageUrl" class="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div class="sm:col-span-2">
        <label class="text-sm">Descripción (HTML o texto)</label>
        <textarea v-model="local.description" rows="5" class="w-full px-3 py-2 border rounded-lg"></textarea>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <button
        type="submit"
        class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>
