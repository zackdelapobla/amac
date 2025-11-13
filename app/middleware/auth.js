export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  // Permitir la página de login sin token
  if (to.path === '/admin/login') return
  if (!token.value) return navigateTo('/admin/login')
})
