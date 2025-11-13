<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-[1000] space-y-3">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="w-80 rounded-xl shadow-lg border p-3 pr-4 text-sm flex gap-3 items-start animate-[fadeIn_.2s_ease]"
        :class="{
          'bg-emerald-50 border-emerald-200 text-emerald-900': t.type==='success',
          'bg-red-50 border-red-200 text-red-900': t.type==='error',
          'bg-slate-50 border-slate-200 text-slate-900': t.type==='info'
        }"
      >
        <span class="mt-0.5">
          <span v-if="t.type==='success'">✅</span>
          <span v-else-if="t.type==='error'">⚠️</span>
          <span v-else>💬</span>
        </span>
        <div class="flex-1">
          <p v-if="t.title" class="font-semibold leading-tight">{{ t.title }}</p>
          <p class="leading-snug">{{ t.message }}</p>
        </div>
        <button class="opacity-60 hover:opacity-100" @click="remove(t.id)">✕</button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const { toasts, remove } = useToast()
</script>

<style>
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }
</style>
