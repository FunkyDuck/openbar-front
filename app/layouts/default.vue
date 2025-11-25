<script setup lang="ts">
  import Header from "~/components/Header.vue";
  import Footer from "~/components/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-500">
    <Header />

    <main class="flex-grow">
      <slot />
    </main>

    <Footer />
  </div>
</template>
