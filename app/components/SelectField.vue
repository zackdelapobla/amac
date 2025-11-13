<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Selecciona una opción'
    },
    options: {
        // Puede ser ['a', 'b'] o [{ value: 'a', label: 'A' }]
        type: Array,
        default: () => []
    },
    valueKey: {
        type: String,
        default: 'value'
    },
    labelKey: {
        type: String,
        default: 'label'
    },
    error: {
        type: String,
        default: ''
    },
    help: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const normalizedOptions = computed(() => {
    return props.options.map(opt => {
        if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: opt, label: opt }
        }
        return {
            value: opt[props.valueKey],
            label: opt[props.labelKey]
        }
    })
})

const onChange = (e) => {
    emit('update:modelValue', e.target.value)
}
</script>

<template>
    <div class="space-y-1.5">
        <div v-if="label" class="flex items-center gap-1">
            <label class="text-sm text-slate-700 font-medium">
                {{ label }}
            </label>
            <span v-if="required" class="text-xs text-red-500">*</span>
        </div>

        <select :value="modelValue ?? ''" :disabled="disabled" @change="onChange" @blur="emit('blur')" class="w-full px-3 py-2 rounded-lg border text-sm
             bg-white text-slate-800
             focus:outline-none focus:ring-2 focus:ring-emerald-500
             disabled:bg-slate-100 disabled:text-slate-400" :class="error ? 'border-red-300' : 'border-slate-300'">
            <option value="">{{ placeholder }}</option>
            <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
            </option>
        </select>

        <p v-if="help && !error" class="text-xs text-slate-500">
            {{ help }}
        </p>
        <p v-if="error" class="text-xs text-red-500">
            {{ error }}
        </p>
    </div>
</template>
