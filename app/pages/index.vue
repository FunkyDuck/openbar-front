<script setup lang="ts">
import type { Drink } from '~~/types/drink';

// C'est la magie de Nuxt.
// useFetch appelle notre fichier 'server/api/drinks.get.ts'
// Comme si c'était une vraie API externe.
const { data: drinks, pending } = await useFetch<Drink[]>('/api/drink');
</script>

<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Header simple -->
    <header class="bg-white border-b border-slate-200 py-6">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-slate-800">
            🍷 Open Bar
            <span class="text-slate-400 text-sm font-normal ml-2">Alpha</span>
          </h1>
          <button class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors">
            Proposer une boisson
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">

      <!-- Intro -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Exploration</h2>
        <p class="text-slate-600">Découvrez des pépites du monde entier.</p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12 text-slate-400">
        Chargement des bouteilles...
      </div>

      <!-- Grid des boissons -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DrinkCard
            v-for="drink in drinks"
            :key="drink.id"
            :drink="drink"
        />
      </div>

    </main>
  </div>
</template>