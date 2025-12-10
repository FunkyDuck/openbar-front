<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// État du menu mobile
const isMenuOpen = ref(false);

const isActive = (path: string) => route.path === path;

// Fermer le menu quand on change de page (UX indispensable)
watch(route, () => {
  isMenuOpen.value = false;
});

// --- LOGIQUE RECHERCHE ---
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/explore',
      query: { q: searchQuery.value }
    });
    // On ferme le menu mobile après une recherche
    isMenuOpen.value = false;
  }
};
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4 relative bg-white z-20">

      <!-- ZONE GAUCHE : LOGO -->
      <NuxtLink to="/" class="flex items-center gap-2 group select-none shrink-0">
        <img
            src="/logo-v1.svg"
            alt="Logo Open Bar"
            class="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onerror="this.style.display='none'"
        />
        <span class="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
          Open Bar
        </span>
      </NuxtLink>

      <!-- ZONE CENTRE : BARRE DE RECHERCHE (Desktop uniquement) -->
      <div class="flex-1 max-w-md hidden lg:block">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
              v-model="searchQuery"
              @keydown.enter="handleSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all shadow-inner"
              placeholder="Rechercher une boisson, un pays..."
          />
        </div>
      </div>

      <!-- ZONE DROITE : ACTIONS -->
      <div class="flex items-center gap-3 shrink-0">

        <!-- Menu Desktop -->
        <nav class="hidden lg:flex items-center gap-6 mr-4">
          <NuxtLink to="/explore" class="text-sm font-medium transition-colors" :class="isActive('/explore') ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-amber-600'">
            Catalogue
          </NuxtLink>
          <NuxtLink to="/map" class="text-sm font-medium transition-colors" :class="isActive('/map') ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-amber-600'">
            Carte
          </NuxtLink>
        </nav>

        <!-- Bouton Contribuer (Toujours visible, icône seule sur mobile) -->
        <button class="bg-slate-900 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow flex items-center gap-2">
          <span class="text-lg leading-none">+</span>
          <span class="hidden sm:inline">Ajouter</span>
        </button>

        <!-- BOUTON BURGER (Mobile) -->
        <!-- Il change d'aspect (croix/burger) selon l'état isMenuOpen -->
        <button
            @click="isMenuOpen = !isMenuOpen"
            class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Menu"
        >
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ============================================= -->
    <!-- MENU MOBILE DÉROULANT (Visible si isMenuOpen) -->
    <!-- ============================================= -->
    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="isMenuOpen" class="lg:hidden absolute top-16 left-0 w-full bg-white border-t border-slate-200 shadow-xl p-4 z-10 flex flex-col gap-4">

        <!-- Barre de recherche Mobile -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
              v-model="searchQuery"
              @keydown.enter="handleSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              placeholder="Que cherchez-vous ?"
          />
        </div>

        <!-- Liens de navigation -->
        <nav class="flex flex-col gap-2">
          <NuxtLink to="/explore" class="px-4 py-3 rounded-lg font-medium transition-colors" :class="isActive('/explore') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'">
            Catalogue complet
          </NuxtLink>
          <NuxtLink to="/map" class="px-4 py-3 rounded-lg font-medium transition-colors" :class="isActive('/map') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'">
            Carte du Monde
          </NuxtLink>
          <NuxtLink to="/about" class="px-4 py-3 rounded-lg font-medium transition-colors" :class="isActive('/about') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'">
            À propos
          </NuxtLink>
        </nav>

      </div>
    </transition>

  </header>
</template>