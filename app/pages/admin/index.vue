<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { listSpecies } = useSpecies()
//const { listProjects } = useProjects()

const speciesCount = ref(0)
//const projectsCount = ref(0)

onMounted(async () => {
    const s = await listSpecies()
    //const p = await listProjects()
    speciesCount.value = s.length
    //projectsCount.value = p.length
})
</script>

<template>
    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Resumen</h2>
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="rounded-xl bg-white p-4 border">
                <p class="text-sm text-slate-500">Especies</p>
                <p class="text-3xl font-bold">{{ speciesCount }}</p>
            </div>
           <!--  <div class="rounded-xl bg-white p-4 border">
                <p class="text-sm text-slate-500">Proyectos</p>
                <p class="text-3xl font-bold">{{ projectsCount }}</p>
            </div> -->
        </div>
    </div>
</template>
