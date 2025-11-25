<script setup lang="ts">
import type { Drink } from '~/types/drink';
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const route = useRoute();
const router = useRouter();

const drinkId = route.params.id as string;

const { data: drink, pending, error } = await useFetch<Drink>(`/api/drinks/${drinkId}`, {
  key: `drink-${drinkId}`
});

// Centre de la carte par défaut (Europe)
const mapCenter = [47, 2];
const mapZoom = 4;

const goBack = () => router.back();
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <button
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors font-medium"
    >
      <span>←</span> Retour à la cave
    </button>

    <div v-if="pending" class="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
      <div class="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      <div class="animate-pulse">Préparation de la fiche...</div>
    </div>

    <div v-else-if="error || !drink" class="bg-red-50 p-8 rounded-xl text-center border border-red-100">
      <h2 class="text-xl font-bold text-red-700 mb-2">Bouteille introuvable</h2>
      <p class="text-red-500 mb-4">Impossible de récupérer les informations de cette boisson.</p>
      <NuxtLink to="/" class="text-sm font-bold text-red-700 hover:underline">Retour à l'accueil</NuxtLink>
    </div>

    <article v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

      <!-- BLOC 1 : IDENTITY -->
      <section class="grid grid-cols-1 md:grid-cols-2">

        <div class="relative h-[400px] md:h-[500px] bg-slate-50 flex items-center justify-center p-8 group">
          <img
              v-if="drink.imageUrl"
              :src="drink.imageUrl"
              :alt="drink.name"
              class="max-h-full max-w-full object-contain drop-shadow-xl mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
          <span v-else class="text-6xl opacity-20">🍷</span>
        </div>

        <div class="p-8 md:p-12 flex flex-col justify-center">
          <div class="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            <span class="text-lg">{{ drink.flag }}</span>
            <span>{{ drink.country }}</span>
            <span v-if="drink.region" class="text-slate-300">•</span>
            <span v-if="drink.region" class="text-slate-600">{{ drink.region }}</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {{ drink.name }}
          </h1>

          <div class="flex flex-wrap gap-3 mb-8">
                <span class="px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-sm font-bold tracking-wide">
                    {{ drink.type }}
                </span>
            <span class="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-bold tabular-nums">
                    {{ drink.degree }}°
                </span>
          </div>

          <div v-if="drink.tags && drink.tags.length">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Profil</h3>
            <ul class="flex flex-wrap gap-2">
              <li
                  v-for="tag in drink.tags"
                  :key="tag"
                  class="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 italic"
              >
                #{{ tag }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- BLOC 2 :: Story -->
      <section class="px-8 md:px-12 py-12 border-t border-slate-100 max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span>📖</span> L'Histoire
        </h2>
        <div class="prose prose-slate prose-lg text-slate-600 leading-relaxed">
          <p class="whitespace-pre-line">
            {{ drink.description || "Aucune description n'a encore été rédigée pour cet alcool." }}
          </p>
        </div>
      </section>

      <!-- BLOC 3 :: MAP -->
      <section class="grid grid-cols-1 lg:grid-cols-3 border-t border-slate-100">
        <div class="p-8 md:p-12 bg-amber-50/50 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
          <h3 class="text-amber-900 font-bold text-xl mb-4 flex items-center gap-2">
            <span>📍</span> Origine
          </h3>
          <p class="text-slate-700 mb-2">
            Ce produit est originaire de <strong>{{ drink.country }}</strong>.
          </p>
          <p v-if="drink.region" class="text-slate-600 text-sm">
            Plus précisément de la région : <strong class="text-amber-700">{{ drink.region }}</strong>.
          </p>
        </div>

        <div class="col-span-2 h-80 lg:h-auto relative z-0 bg-slate-100">
          <ClientOnly>
            <LMap
                ref="map"
                :zoom="mapZoom"
                :center="mapCenter"
                :use-global-leaflet="false"
                class="h-full w-full"
            >
              <LTileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap contributors"
              />
              <LMarker :lat-lng="mapCenter" />
            </LMap>

            <template #fallback>
              <div class="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50">
                Chargement de la carte...
              </div>
            </template>
          </ClientOnly>
        </div>
      </section>

    </article>
  </div>
</template>

<style scoped>
.leaflet-container {
  background: #f1f5f9;
}
</style>