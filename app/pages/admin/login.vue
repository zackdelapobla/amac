<script setup>
definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const remember = ref(true)
const loading = ref(false)
const error = ref(null)

const { login } = useApi()

const doLogin = async () => {
  error.value = null
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin') // dashboard
  } catch (e) {
    error.value = e?.data?.message || 'Credenciales inválidas o error de servidor'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="doLogin" class="space-y-6 mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-emerald-900 text-center">Iniciar sesión</h1>
      <p class="text-sm text-slate-600 text-center mt-1">
        Accede al panel de administración
      </p>
    </div>
    <div v-if="error" class="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
      {{ error }}
    </div>

    <div>
      <label class="block text-slate-700 text-sm font-medium mb-1">Email</label>
      <input v-model="email" type="email" required
        class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
    </div>

    <div>
      <label class="block text-slate-700 text-sm font-medium mb-1">Contraseña</label>
      <input v-model="password" type="password" required
        class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
    </div>

    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" v-model="remember" class="rounded border-slate-300" />
        Recordarme
      </label>
      <NuxtLink to="/" class="text-sm text-emerald-700 hover:underline">Volver al sitio</NuxtLink>
    </div>

    <button
      :disabled="loading"
      type="submit"
      class="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
    >
      {{ loading ? 'Ingresando…' : 'Ingresar' }}
    </button>
  </form>
</template>
