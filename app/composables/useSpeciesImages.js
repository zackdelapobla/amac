// composables/useSpeciesImages.js
export const useSpeciesImages = () => {
    const { get, post, del, put } = useApi()

    const listImages = async (specieId) => {
        const res = await get(`species/${specieId}/images`)
        return res?.data ?? res ?? []
    }

    const uploadImage = async (specieId, { file, caption, author, source, license, isPrimary }) => {
        const form = new FormData()
        form.append('file', file)
        if (caption) form.append('caption', caption)
        if (author) form.append('author', author)
        if (source) form.append('source', source)
        if (license) form.append('license', license)
        if (isPrimary != null) form.append('isPrimary', isPrimary ? 'true' : 'false')

        // OJO: no sets content-type, $fetch lo hace
        return post(`species/${specieId}/images`, form)
    }

    const deleteImage = (imageId) => del(`species-images/${imageId}`)
    const markPrimary = (imageId) => put(`species-images/${imageId}/primary`)

    return { listImages, uploadImage, deleteImage, markPrimary }
}
