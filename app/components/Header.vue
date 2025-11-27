<script setup lang="ts">
  const route = useRoute();

  const isActive = (path: string) => route.path === path;
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 group select-none">
        <img
            src="/logo-v1.svg"
            alt="Logo Open Bar"
            class="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />

        <span class="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
          Open Bar
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
            to="/"
            class="text-sm font-medium transition-color relative py-1"
            :class="isActive('/') ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-amber-600'"
        >
          Explorer
          <span v-if="isActive('/')" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"></span>
        </NuxtLink>

        <NuxtLink
            to="/map"
            class="text-sm font-medium transition-color relative py-1"
            :class="isActive('/map') ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-amber-600'"
        >
          Carte
          <span v-if="isActive('/map')" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"></span>
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <button class="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0">
          Contribuer
        </button>

        <button class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>