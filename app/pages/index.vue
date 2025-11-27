<script setup lang="ts">
import type { Drink } from '~/types/drink';

const { data: drinks, pending } = await useFetch<Drink[]>('/api/drinks');
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Exploration</h2>
        <p class="text-slate-600">Découvrez des pépites du monde entier.</p>
      </div>

      <div v-if="pending" class="text-center py-12 text-slate-400">
        Chargement des bouteilles...
      </div>

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