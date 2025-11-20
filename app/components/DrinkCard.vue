<script setup lang="ts">
import type { Drink } from '~/types/drink';

// On définit ce que le composant reçoit comme données
defineProps<{
  drink: Drink
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100">
    <!-- Image (Zone haute) -->
    <div class="h-48 bg-slate-100 relative overflow-hidden group">
      <img
          v-if="drink.imageUrl"
          :src="drink.imageUrl"
          :alt="drink.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Badge Type en haut à gauche -->
      <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700 uppercase tracking-wider">
            {{ drink.type }}
        </span>
    </div>

    <!-- Contenu (Zone basse) -->
    <div class="p-5">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="font-bold text-lg text-slate-800 leading-tight">{{ drink.name }}</h3>
          <p class="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <span>{{ drink.flag }}</span>
            <span>{{ drink.country }}</span>
          </p>
        </div>
        <div class="text-right">
          <span class="block text-lg font-bold text-amber-600">{{ drink.degree }}%</span>
        </div>
      </div>

      <p class="text-slate-600 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
        {{ drink.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mt-auto">
        <span
            v-for="tag in drink.tags"
            :key="tag"
            class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
        >
            #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>