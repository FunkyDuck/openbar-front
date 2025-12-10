<script setup lang="ts">
import type { Drink } from '~/types/drink';

const route = useRoute();
const router = useRouter();

// --- 1. DONNÉES ---
// On charge tout le catalogue (Pour le MVP, le filtrage se fera côté client)
const { data: allDrinks, pending, error } = await useFetch<Drink[]>('/api/drinks', {
  key: 'explore-all'
});

// --- 2. ÉTAT DES FILTRES ---
const searchQuery = ref((route.query.q as string) || '');
const selectedType = ref<string>('');
const selectedCountry = ref<string>('');
const selectedTags = ref<string[]>([]);
const showFiltersMobile = ref(false); // Pour le menu mobile

// Listes pour les filtres (Calculées dynamiquement ou statiques)
const types = ['Liqueur', 'Spirit', 'FruitBrandy', 'Beer', 'Wine', 'CiderAndFermented', 'Other'];
// On extrait les pays uniques présents dans la base
const countries = computed(() => {
  if (!allDrinks.value) return [];
  return [...new Set(allDrinks.value.map(d => d.country))].sort();
});
// Quelques tags populaires (à enrichir)
const popularTags = ['Amer', 'Fruité', 'Sec', 'Herbacé', 'Sucré', 'Café', 'Épicé'];

// --- 3. LOGIQUE DE FILTRAGE ---
const filteredDrinks = computed(() => {
  if (!allDrinks.value) return [];

  return allDrinks.value.filter(drink => {
    // 1. Recherche Texte (Nom ou Description)
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = !query ||
        drink.name.toLowerCase().includes(query) ||
        drink.description?.toLowerCase().includes(query);

    // 2. Filtre Type
    const matchesType = !selectedType.value || drink.type === selectedType.value;

    // 3. Filtre Pays
    const matchesCountry = !selectedCountry.value || drink.country === selectedCountry.value;

    // 4. Filtre Tags (Doit contenir TOUS les tags sélectionnés)
    const matchesTags = selectedTags.value.length === 0 ||
        selectedTags.value.every(tag => drink.tags.includes(tag));

    return matchesSearch && matchesType && matchesCountry && matchesTags;
  });
});

// Mise à jour de l'URL quand on cherche (pour pouvoir partager le lien)
watch(searchQuery, (newVal) => {
  router.replace({ query: { ...route.query, q: newVal || undefined } });
});

// Reset des filtres
const resetFilters = () => {
  searchQuery.value = '';
  selectedType.value = '';
  selectedCountry.value = '';
  selectedTags.value = [];
};

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">

    <!-- EN-TÊTE DE PAGE -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Catalogue</h1>
        <p class="text-slate-500 text-sm mt-1">
          {{ filteredDrinks.length }} référence{{ filteredDrinks.length > 1 ? 's' : '' }} trouvée{{ filteredDrinks.length > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Barre de recherche (Répétée ici pour le confort) -->
      <div class="relative w-full md:w-72">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">🔍</span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Chercher une bouteille..."
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
      </div>

      <!-- Bouton Filtres (Mobile Only) -->
      <button
          @click="showFiltersMobile = !showFiltersMobile"
          class="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium shadow-sm active:bg-slate-50"
      >
        <span>⚡ Filtres</span>
        <span v-if="selectedTags.length || selectedType || selectedCountry" class="flex h-2 w-2 rounded-full bg-amber-500"></span>
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-8 items-start">

      <!-- SIDEBAR FILTRES (Desktop: Sticky / Mobile: Modal ou Accordéon) -->
      <aside
          class="w-full md:w-64 flex-shrink-0 space-y-8 p-6 bg-white rounded-xl border border-slate-100 shadow-sm transition-all duration-300"
          :class="showFiltersMobile ? 'block' : 'hidden md:block'"
      >
        <!-- En-tête Filtres -->
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 uppercase tracking-wide text-sm">Filtres</h3>
          <button
              v-if="selectedType || selectedCountry || selectedTags.length"
              @click="resetFilters"
              class="text-xs text-amber-600 hover:underline"
          >
            Tout effacer
          </button>
        </div>

        <!-- Filtre : PAYS -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Pays d'origine</label>
          <select v-model="selectedCountry" class="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:ring-amber-500 focus:border-amber-500">
            <option value="">Tous les pays</option>
            <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
          </select>
        </div>

        <!-- Filtre : TYPE -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Type d'alcool</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="selectedType" value="" class="text-amber-600 focus:ring-amber-500" />
              <span class="text-sm text-slate-600">Tous</span>
            </label>
            <label v-for="type in types" :key="type" class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" v-model="selectedType" :value="type" class="text-amber-600 focus:ring-amber-500" />
              <span class="text-sm text-slate-600 group-hover:text-amber-700">{{ type }}</span>
            </label>
          </div>
        </div>

        <!-- Filtre : GOÛTS (Tags) -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Profil gustatif</label>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="tag in popularTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="px-3 py-1 rounded-full text-xs border transition-colors"
                :class="selectedTags.includes(tag) ? 'bg-amber-100 border-amber-200 text-amber-800 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </aside>

      <!-- GRILLE RÉSULTATS -->
      <div class="flex-grow min-w-0">

        <!-- Tags Actifs (Résumé) -->
        <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in selectedTags" :key="tag" class="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-white text-xs rounded-full">
                    {{ tag }}
                    <button @click="toggleTag(tag)" class="hover:text-amber-400">×</button>
                </span>
        </div>

        <!-- État Chargement -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Squelettes de chargement -->
          <div v-for="i in 6" :key="i" class="h-80 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>

        <!-- État Vide -->
        <div v-else-if="filteredDrinks.length === 0" class="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <span class="text-4xl mb-2">🥃</span>
          <h3 class="text-lg font-bold text-slate-700">Aucun résultat</h3>
          <p class="text-slate-500 mb-4">Essayez de modifier vos filtres.</p>
          <button @click="resetFilters" class="text-amber-600 font-bold hover:underline">Réinitialiser tout</button>
        </div>

        <!-- Grille -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DrinkCard
              v-for="drink in filteredDrinks"
              :key="drink.id"
              :drink="drink"
          />
        </div>

      </div>

    </div>
  </div>
</template>