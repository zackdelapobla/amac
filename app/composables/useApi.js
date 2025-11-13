// composables/useApi.js
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase // ej: http://localhost:4000/api

  const token = useCookie('token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // en dev HTTP => false
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  const setToken = (t) => { token.value = t || null }
  const clearToken = () => { token.value = null }

  const handleUnauthorized = async () => {
    clearToken()
    if (process.client) await navigateTo('/admin/login')
    else throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Fusiona headers con Authorization siempre que haya token
  const withAuthHeaders = (opts = {}) => {
    const baseHeaders = opts.headers || {}
    const auth = token.value ? { Authorization: `Bearer ${token.value}` } : {}
    return { ...opts, headers: { ...baseHeaders, ...auth } }
  }

  const fetcher = (endpoint, opts = {}) => {
    // 1) asegura headers en la propia options
    const finalOpts = withAuthHeaders(opts)

    return $fetch(endpoint, {
      baseURL,
      // 2) vuelve a asegurar en el hook (doble cinturón y tirantes)
      onRequest({ options }) {
        options.headers = options.headers || {}
        if (token.value) {
          options.headers.Authorization = `Bearer ${token.value}`
        }
        // DEBUG: comentar después
        // console.debug('[useApi] request', { endpoint, hasAuth: !!token.value })
      },
      onResponseError({ response }) {
        if (response.status === 401) return handleUnauthorized()
      },
      ...finalOpts
    })
  }

  // Atajos
  const get  = (endpoint, params)  => fetcher(endpoint, { method: 'GET', params })
  const post = (endpoint, body)     => fetcher(endpoint, { method: 'POST', body })
  const put  = (endpoint, body)     => fetcher(endpoint, { method: 'PUT', body })
  const del  = (endpoint, params)   => fetcher(endpoint, { method: 'DELETE', params })

  // Auth
  const login = async (email, password) => {
    const res = await $fetch('/auth/login', { baseURL, method: 'POST', body: { email, password } })
    if (res?.token) setToken(res.token)
    return res
  }

  const logout = async () => {
    try {
      // opcional: await $fetch('/auth/logout', { baseURL, method: 'POST' })
    } finally {
      clearToken()
      if (process.client) await navigateTo('/admin/login')
    }
  }

  const refresh = async () => {
    const res = await $fetch('/auth/refresh', { baseURL, method: 'POST' })
    if (res?.token) setToken(res.token)
    return res
  }

  return { get, post, put, del, login, logout, refresh, setToken, clearToken, token }
}
