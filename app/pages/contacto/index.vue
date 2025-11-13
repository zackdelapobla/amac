<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const agree = ref(false)
const sending = ref(false)
const success = (null)
const errorMsg = (null)


</script>

<template>
    <section class="bg-gradient-to-b from-emerald-900/20 to-slate-950">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div class="mb-10 text-center">
                <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">Contacto</h1>
                <p class="mt-3 text-slate-300 max-w-2xl mx-auto">
                    ¿Tienes una idea, proyecto o consulta? Escríbenos y te responderemos pronto.
                </p>
            </div>

            <div class="grid lg:grid-cols-5 gap-8">
                <!-- Info -->
                <aside class="lg:col-span-2 space-y-6">
                    <div
                        class="rounded-2xl border  border-yellow-400 p-6 shadow-sm bg-slate-900/50">
                        <h2 class="text-lg font-semibold">Información</h2>
                        <ul class="mt-4 space-y-3 text-slate-300">
                            <li><strong>Email:</strong> contacto@amacperalillo.com</li>
                            <li><strong>Teléfono:</strong> +56 9 1234 5678</li>
                            <li><strong>Comuna:</strong> Peralillo, Chile</li>
                        </ul>
                    </div>

                    <div class="rounded-2xl overflow-hidden shadow-sm border  border-yellow-400">
                        <!-- Mapa embed (reemplaza con tu ubicación) -->
                        <iframe title="Mapa Peralillo" src="https://www.google.com/maps?q=Peralillo,Chile&output=embed"
                            class="w-full h-64" loading="lazy"></iframe>
                    </div>
                </aside>

                <!-- Formulario -->
                <div class="lg:col-span-3">
                    <form @submit.prevent="submitForm"
                        class="rounded-2xl border border-yellow-400 p-6 sm:p-8 shadow-sm bg-slate-900/50 backdrop-blur">
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium mb-2" for="name">Nombre</label>
                                <input id="name" v-model="name" type="text" required
                                    class="w-full rounded-xl text-slate-800 border-slate-700 bg-slate-100 focus:border-emerald-500 focus:ring-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2" for="email">Email</label>
                                <input id="email" v-model="email" type="email" required
                                    class="w-full rounded-xl text-slate-800 border-slate-700 bg-slate-100 focus:border-emerald-500 focus:ring-emerald-500"/>
                            </div>
                        </div>

                        <div class="mt-6">
                            <label class="block text-sm font-medium mb-2" for="subject">Asunto</label>
                            <input id="subject" v-model="subject" type="text" required
                                class="w-full rounded-xl text-slate-800 border-slate-700 bg-slate-100 focus:border-emerald-500 focus:ring-emerald-500" />
                        </div>

                        <div class="mt-6">
                            <label class="block text-sm font-medium mb-2" for="message">Mensaje</label>
                            <textarea id="message" v-model="message" rows="6" required
                                class="w-full rounded-xl text-slate-800 border-slate-700 bg-slate-100 focus:border-emerald-500 focus:ring-emerald-500"></textarea>
                        </div>

                        <div class="mt-6 flex items-center gap-3">
                            <input id="agree" v-model="agree" type="checkbox"
                                class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                            <label for="agree" class="text-sm text-slate-300">
                                Acepto que AMAC use estos datos solo para responder mi consulta.
                            </label>
                        </div>

                        <!-- Mensajes -->
                        <p v-if="errorMsg" class="mt-4 text-sm text-red-600">{{ errorMsg }}</p>
                        <p v-if="success" class="mt-4 text-sm text-emerald-700">{{ success }}</p>

                        <div class="mt-8 flex items-center gap-4">
                            <button type="submit" :disabled="sending"
                                class="inline-flex items-center rounded-xl bg-amac-green px-5 py-3 text-base font-semibold text-white shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amac-green/60 disabled:opacity-60">
                                <svg v-if="sending" class="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" />
                                </svg>
                                {{ sending ? 'Enviando…' : 'Enviar mensaje' }}
                            </button>
                            <p class="text-xs text-slate-500">Tiempo de respuesta habitual: 24–48 h.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>