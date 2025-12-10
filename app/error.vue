<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <!-- On force l'utilisation du layout "default" pour garder le menu -->
  <NuxtLayout name="default">
    <div class="container mx-auto px-4 py-12 max-w-3xl flex flex-col items-center justify-center min-h-[60vh]">

      <div class="text-center mb-8">
        <!-- Icône -->
        <span class="text-6xl mb-4 block select-none">
            {{ error.statusCode === 404 ? '🗺️' : '💥' }}
        </span>

        <!-- Titre -->
        <h1 class="text-4xl font-bold text-slate-900 mb-4">
          {{ error.statusCode === 404 ? 'Erreur 404' : 'Erreur inattendue' }}
        </h1>

        <!-- Image -->
        <img
            v-if="error.statusCode === 404"
            src="/empty_bottle.jpg"
            alt="Bouteille vide"
            class="mx-auto mb-6 max-h-64 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            onerror="this.style.display='none'"
        />

        <!-- Message -->
        <p class="text-xl text-slate-600 mb-8 max-w-md mx-auto">
          {{ error.statusCode === 404
            ? "La liqueur souhaitée n'est plus disponible... ou n'a jamais existé."
            : "Le barman a renversé un verre. Nos équipes nettoient ça."
          }}
        </p>

        <!-- Action -->
        <button
            @click="handleError"
            class="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg"
        >
          Retour à l'accueil
        </button>
      </div>

    </div>
  </NuxtLayout>
</template>

<style scoped>
</style>