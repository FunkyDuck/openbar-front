<script setup lang="ts">
  const baseYear = 2025;
  const currentYear = new Date().getFullYear();

  const displayYear = computed(() => {
    if(currentYear <= baseYear) {
      return baseYear;
    }
    return `${baseYear} - ${currentYear}`;
  })
</script>

<template>
  <footer class="bg-white border-t border-slate-200 py-8 mt-auto">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
      <nav>
        <p class="flex items-center gap-1">
          <NuxtLink to="https://open-bar.ovh" class="font-bold text-slate-700 hover:text-amber-600 transition-colors">
            Open Bar
          </NuxtLink>
          by
          <NuxtLink to="https://funkyduck.be" class="font-bold text-slate-700 hover:text-amber-600 transition-colors">
            FunkyDuck
          </NuxtLink>
          © {{ displayYear }}
        </p>
      </nav>

      <nav class="flex gap-6">
        <NuxtLink to="/cgu" class="hover:text-amber-600 transition-colors">CGU</NuxtLink>
        <NuxtLink to="/about" class="hover:text-amber-600 transition-colors">A propos</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>

</style>