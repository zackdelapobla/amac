// composables/useSpecies.js
export const useSpecies = () => {
  const { get, post, put, del } = useApi()

  // Helpers para normalizar respuestas (array vs { data: [...] })
  const normalizeList = (res) => {
    if (Array.isArray(res)) return res
    if (res?.data && Array.isArray(res.data)) return res.data
    return []
  }
  const normalizeItem = (res) => (res?.data ?? res ?? null)

  // Limpia params: elimina claves vacías/undefined
  const cleanParams = (obj = {}) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== '' && v !== undefined && v !== null))

  // Listado (con búsqueda opcional)
  const listSpecies = async (params = {}) => {
    const p = cleanParams(params)
    const res = await get('species', p)        // <-- asegúrate que tu backend expone /api/species
    return normalizeList(res)
  }

  // Detalle por slug
  const getSpeciesBySlug = async (slug) => {
    const res = await get(`species/slug/${encodeURIComponent(slug)}`)
    return normalizeItem(res)
  }

  const getSpeciesById = async (id) => normalizeItem(await get(`species/${id}`))

  // Admin CRUD
  const createSpecies = (payload) => post('species', payload)
  const updateSpecies = (id, payload) => put(`species/${id}`, payload)
  const deleteSpecies = (id) => del(`species/${id}`)

  return {
    listSpecies,
    getSpeciesById,
    getSpeciesBySlug,
    createSpecies,
    updateSpecies,
    deleteSpecies
  }
}
