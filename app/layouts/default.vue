<template>

    <div class="min-h-dvh flex flex-col">
        <MenuBar />
        <main class="flex-1">
            <slot />
        </main>
    </div>
    <footer class="border-t border-amber-500  py-8">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-slate-200">
            © {{ new Date().getFullYear() }} AMAC. Todos los derechos reservados.
        </div>
    </footer>
    
</template>