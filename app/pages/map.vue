<script setup lang="ts">
import type { Drink } from '~/types/drink';
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

// --- 1. DONNÉES ---
// On récupère toutes les boissons
const { data: allDrinks } = await useFetch<Drink[]>('/api/drinks', {
  key: 'map-drinks'
});

// État de la sélection (Null = Monde entier, Sinon = Code Pays ISO)
const selectedCountryCode = ref<string | null>(null);
const mapRef = ref(null); // Pour piloter le zoom

// --- 2. CALCULS ---

// Liste des pays disponibles (déduite des boissons)
const availableCountries = computed(() => {
  if (!allDrinks.value) return [];

  const countriesMap = new Map();

  allDrinks.value.forEach(drink => {
    // On ignore les boissons sans code pays (ou on pourrait gérer un fallback)
    if (!drink.countryCode) return;

    const code = drink.countryCode.toUpperCase();

    if (!countriesMap.has(code)) {
      countriesMap.set(code, {
        code: code,
        name: drink.country,
        flag: drink.flag,
        count: 0,
        drinks: [] // On stocke les boissons de ce pays
      });
    }

    const country = countriesMap.get(code);
    country.count++;
    country.drinks.push(drink);
  });

  return Array.from(countriesMap.values());
});

// Liste affichée dans le panneau latéral (Soit les pays, soit les boissons du pays sélectionné)
const sidebarContent = computed(() => {
  if (selectedCountryCode.value) {
    // Si un pays est sélectionné, on retourne ses boissons
    const country = availableCountries.value.find(c => c.code === selectedCountryCode.value);
    return { type: 'drinks', data: country?.drinks || [], title: country?.name };
  } else {
    // Sinon, on retourne la liste des pays
    return { type: 'countries', data: availableCountries.value, title: 'Destinations' };
  }
});

// --- 3. GEOJSON (TRACÉS) ---
const geoJsonCache = ref<Record<string, any>>({});

// Charger les tracés de TOUS les pays disponibles
const loadAllGeoJson = async () => {
  for (const country of availableCountries.value) {
    if (!geoJsonCache.value[country.code]) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/johan/world.geo.json/master/countries/${country.code}.geo.json`);
        if (res.ok) {
          geoJsonCache.value[country.code] = await res.json();
        }
      } catch (e) {
        console.error(`Erreur GeoJSON ${country.code}`, e);
      }
    }
  }
};

// On lance le chargement dès qu'on a les données
watchEffect(() => {
  if (availableCountries.value.length > 0) {
    loadAllGeoJson();
  }
});

// --- 4. INTERACTIONS ---

// Style dynamique des pays sur la carte
const getGeoJsonOptions = (countryCode: string) => {
  const isSelected = selectedCountryCode.value === countryCode;
  return {
    style: () => ({
      color: isSelected ? '#b45309' : '#d97706', // Bordure plus foncée si sélectionné
      weight: isSelected ? 3 : 2, // Bordure un peu plus épaisse au repos pour visibilité
      opacity: 1,
      fillColor: isSelected ? '#f59e0b' : 'transparent', // Transparent par défaut
      fillOpacity: isSelected ? 0.6 : 0 // Opacité 0 par défaut
    }),
    onEachFeature: (feature: any, layer: any) => {
      // Clic sur la carte
      layer.on('click', () => selectCountry(countryCode));

      // Curseur main au survol
      layer.on('mouseover', () => { layer.getElement()?.classList.add('cursor-pointer'); });
    }
  };
};

// Action de sélection
const selectCountry = (code: string) => {
  selectedCountryCode.value = code;

  // Zoom sur le pays
  const geojson = geoJsonCache.value[code];
  if (geojson && mapRef.value) {
    // @ts-ignore
    const leafletLayer = L.geoJSON(geojson); // On crée un calque temporaire juste pour calculer les limites
    // @ts-ignore
    mapRef.value.leafletObject.fitBounds(leafletLayer.getBounds(), { padding: [50, 50], maxZoom: 6 });
  }
};

// Action de retour (Reset)
const resetSelection = () => {
  selectedCountryCode.value = null;
  if (mapRef.value) {
    // @ts-ignore
    mapRef.value.leafletObject.setView([48, 15], 4); // Retour vue Europe
  }
};

const router = useRouter();
const goToDrink = (id: string) => {
  router.push(`/drinks/${id}`);
};
</script>

<template>
  <div class="relative w-full h-[calc(100vh-4rem)] bg-slate-200 overflow-hidden">

    <!-- CARTE -->
    <ClientOnly>
      <LMap
          ref="map"
          :zoom="4"
          :center="[48, 15]"
          :use-global-leaflet="false"
          class="h-full w-full z-0 outline-none"
      >
        <LTileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
        />

        <!-- On affiche un calque GeoJSON par pays disponible -->
        <LGeoJson
            v-for="(geojson, code) in geoJsonCache"
            :key="code"
            :geojson="geojson"
            :options="getGeoJsonOptions(code as string)"
        />
      </LMap>
    </ClientOnly>

    <!-- OVERLAY GAUCHE : STATS -->
    <!-- Z-Index réduit à 30 pour passer sous le header (z-50) -->
    <div class="absolute top-4 left-4 z-30 max-w-xs w-full pointer-events-none">
      <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-200/60 pointer-events-auto">
        <h1 class="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span class="text-3xl">🌍</span> Atlas
        </h1>
        <p class="text-slate-600 text-sm mb-4 leading-relaxed">
          {{ selectedCountryCode ? 'Cliquez sur une bouteille pour voir les détails.' : 'Cliquez sur un pays coloré pour explorer.' }}
        </p>

        <!-- Bouton Retour (si pays sélectionné) -->
        <button
            v-if="selectedCountryCode"
            @click="resetSelection"
            class="text-sm flex items-center gap-1 text-slate-500 hover:text-amber-600 font-bold transition-colors"
        >
          <span>←</span> Retour au Monde
        </button>
      </div>
    </div>

    <!-- OVERLAY DROIT : LISTE DYNAMIQUE -->
    <!-- Z-Index réduit à 30. max-h réduit à 30vh sur mobile -->
    <div class="absolute bottom-4 left-4 right-4 md:left-auto md:top-4 md:bottom-4 md:right-4 md:w-80 z-30 flex flex-col pointer-events-none">

      <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col max-h-[30vh] md:max-h-full pointer-events-auto transition-all">

        <!-- En-tête de liste -->
        <div class="p-4 border-b border-slate-100 bg-white/50 sticky top-0 backdrop-blur flex justify-between items-center">
          <h2 class="font-bold text-slate-800 text-sm uppercase tracking-wide">
            {{ sidebarContent.title }}
          </h2>
          <span class="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            {{ sidebarContent.data.length }}
          </span>
        </div>

        <!-- Contenu Scrollable -->
        <div class="overflow-y-auto p-2 space-y-1 custom-scrollbar">

          <!-- CAS 1 : LISTE DES PAYS -->
          <template v-if="sidebarContent.type === 'countries'">
            <button
                v-for="country in sidebarContent.data"
                :key="country.code"
                @click="selectCountry(country.code)"
                class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 transition-all group text-left border border-transparent hover:border-amber-100"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">{{ country.flag }}</span>
                <span class="font-medium text-slate-700 group-hover:text-amber-900">{{ country.name }}</span>
              </div>
              <span class="text-xs font-bold bg-slate-100 group-hover:bg-amber-100 text-slate-500 group-hover:text-amber-700 px-2 py-1 rounded-md">
                {{ country.count }}
              </span>
            </button>
          </template>

          <!-- CAS 2 : LISTE DES BOISSONS -->
          <template v-else>
            <button
                v-for="drink in sidebarContent.data"
                :key="drink.id"
                @click="goToDrink(drink.id)"
                class="w-full flex items-center p-2 rounded-xl hover:bg-slate-50 transition-all group text-left border border-transparent hover:border-slate-200 gap-3"
            >
              <!-- Petite image -->
              <div class="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="drink.imageUrl" :src="drink.imageUrl" class="w-full h-full object-cover" />
                <span v-else>🍷</span>
              </div>

              <div class="flex-grow min-w-0">
                <div class="font-bold text-slate-800 text-sm truncate group-hover:text-amber-700">{{ drink.name }}</div>
                <div class="text-xs text-slate-500 flex gap-2">
                  <span>{{ drink.type }}</span>
                  <span class="text-slate-300">•</span>
                  <span>{{ drink.degree }}°</span>
                </div>
              </div>

              <span class="text-slate-300 group-hover:text-amber-500">→</span>
            </button>
          </template>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
:deep(.leaflet-top.leaflet-left) {
  top: 180px; /* Déplace le zoom pour pas gêner */
  left: 10px;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>