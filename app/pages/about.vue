<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl">

    <!-- Intro -->
    <div class="text-center mb-12">
      <span class="text-6xl mb-4 block">🌍</span>
      <h1 class="text-4xl font-bold text-slate-900 mb-4">Le carnet de voyage liquide</h1>
      <p class="text-xl text-slate-600">
        Parce que chaque pays a une âme, et qu'elle se trouve souvent au fond d'une bouteille locale.
      </p>
    </div>

    <div class="prose prose-slate max-w-none space-y-10">

      <!-- La Mission -->
      <section>
        <h2 class="text-2xl font-bold text-slate-800 mb-4">Pourquoi Open Bar ?</h2>
        <p>
          On connaît tous le Whisky écossais ou la Vodka russe. Mais qui connaît la <strong>Tuica</strong> roumaine ?
          Le <strong>Pelinkovac</strong> croate ? Ou le <strong>Génépi</strong> des Alpes ?
        </p>
        <p>
          L'idée d'Open Bar est née d'un constat simple : quand on voyage, on découvre des trésors locaux qu'on oublie sitôt rentré.
          Ce site est une mémoire collective, une carte aux trésors des spiritueux de terroir, loin des grandes marques industrielles.
        </p>
      </section>

      <!-- La Tech -->
      <section class="bg-slate-100 p-6 rounded-2xl">
        <h2 class="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>💻</span> Sous le capot
        </h2>
        <p class="mb-4">
          Open Bar est un projet open-source développé avec passion. Pour les curieux de la technique, voici ce qui fait tourner la machine :
        </p>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <li class="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <span class="font-bold text-green-600">Vue.js / Nuxt</span>
            <span class="text-sm text-slate-500">Pour une interface fluide</span>
          </li>
          <li class="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <span class="font-bold text-blue-600">Tailwind CSS</span>
            <span class="text-sm text-slate-500">Pour le style</span>
          </li>
          <li class="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <span class="font-bold text-amber-600">PocketBase</span>
            <span class="text-sm text-slate-500">Backend & Database</span>
          </li>
          <li class="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <span class="font-bold text-purple-600">Docker</span>
            <span class="text-sm text-slate-500">Hébergement VPS</span>
          </li>
        </ul>
      </section>

      <!-- L'Auteur -->
      <section class="flex flex-col sm:flex-row items-center gap-6 border-t border-slate-200 pt-8">
        <div class="flex-1 text-center sm:text-left">
          <h3 class="text-lg font-bold text-slate-900">Développé par FunkyDuck</h3>
          <p class="text-slate-500 mt-1">Développeur web & amateur de découvertes.</p>
          <div class="mt-4 flex gap-3 justify-center sm:justify-start">
            <a href="https://funkyduck.be" target="_blank" class="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">
              Mon Portfolio
            </a>
            <a href="https://github.com" target="_blank" class="px-4 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>