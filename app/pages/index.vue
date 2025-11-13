<template>
    <HeroSection />
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid gap-8 md:grid-cols-3">
            <div class="rounded-2xl border border-yellow-400 dark:border-slate-800 p-6 shadow-sm">
                <h3 class="text-lg font-semibold">Educación Ambiental</h3>
                <p class="mt-2 text-slate-400">Talleres y charlas para escuelas y comunidades.</p>
            </div>
            <div class="rounded-2xl border border-yellow-400 dark:border-slate-800 p-6 shadow-sm">
                <h3 class="text-lg font-semibold">Monitoreo Ciudadano</h3>
                <p class="mt-2 text-slate-400">Registra especies nativas y ayuda a su conservación.
                </p>
            </div>
            <div class="rounded-2xl border border-yellow-400 p-6 shadow-sm">
                <h3 class="text-lg font-semibold">Proyectos</h3>
                <p class="mt-2 text-slate-400">Restauración y ciencia abierta.</p>
            </div>
        </div>
    </section>
    <!-- Sección: Quiénes somos -->
    <section id="about" class="bg-gradient-to-b from-emerald-900/20 to-slate-950 py-16 lg:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            
            <div class="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
                <img src="https://res.cloudinary.com/dmljkaovw/image/upload/v1762205561/617c36f9-0825-4118-9d8d-f87fa11cdae7_nhyhue.jpg"
                    alt="Voluntariado AMAC en terreno" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Quiénes somos
                </h2>
                <p class="mt-4 text-slate-300 leading-relaxed">
                    Somos la <strong>Agrupación Medioambiental Cañetenes (AMAC)</strong>, una organización local de
                    Peralillo dedicada a la protección de la flora nativa, la educación ambiental y la restauración ecológica.
                </p>
                <p class="mt-4 text-slate-300 leading-relaxed">
                    Nuestro propósito es conectar a la comunidad con su entorno natural a través de actividades de
                    reforestación, talleres educativos, ciencia ciudadana y proyectos de conservación. Creemos que cuidar el medio ambiente comienza desde lo local, con participación, compromiso y conocimiento.
                </p>
                <div class="mt-6">
                    <NuxtLink to="/contacto"
                        class="inline-flex items-center rounded-xl bg-amac-green px-5 py-3 text-base font-semibold text-black dark:text-white shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amac-green/60">
                        Súmate a AMAC
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>

</template>