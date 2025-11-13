// composables/useToast.js
export const useToast = () => {
  const toasts = useState('toasts', () => [])
  let id = 0

  const push = ({ title = '', message = '', type = 'success', timeout = 3500 } = {}) => {
    const tid = ++id
    const item = { id: tid, title, message, type }
    toasts.value.push(item)
    if (timeout) setTimeout(() => remove(tid), timeout)
    return tid
  }
  const remove = (tid) => { toasts.value = toasts.value.filter(t => t.id !== tid) }

  // helpers
  const success = (m, opts={}) => push({ type: 'success', message: m, ...opts })
  const error   = (m, opts={}) => push({ type: 'error', message: m, ...opts })
  const info    = (m, opts={}) => push({ type: 'info', message: m, ...opts })

  // opcional: envuelve una promesa y muestra estados
  const withToast = async (promise, { loading='Procesando…', ok='Listo', fail='Error' } = {}) => {
    const tid = info(loading, { timeout: 0 })
    try {
      const res = await promise
      remove(tid)
      success(ok)
      return res
    } catch (e) {
      remove(tid)
      error(typeof e?.data?.message === 'string' ? e.data.message : fail)
      throw e
    }
  }

  return { toasts, push, remove, success, error, info, withToast }
}
