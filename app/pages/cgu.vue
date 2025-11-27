<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl">
    <h1 class="text-3xl font-bold text-slate-900 mb-8">Conditions Générales d'Utilisation</h1>
    <p class="text-sm text-slate-500 mb-8">Dernière mise à jour : {{ new Date().toLocaleDateString() }}</p>

    <div class="space-y-8 text-slate-600 leading-relaxed">

      <section class="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500">
        <h2 class="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
          ⚠️ Avertissement Sanitaire & Légal
        </h2>
        <p class="text-amber-900 font-medium mb-2">
          L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
        </p>
        <p class="text-sm text-amber-800">
          L'accès à ce site est strictement réservé aux personnes ayant l'âge légal de consommation d'alcool dans leur pays de résidence (18 ans en France/Belgique). En naviguant sur ce site, vous certifiez avoir l'âge requis.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-800 mb-3">1. Présentation du site</h2>
        <p>
          Open Bar est une plateforme collaborative à but non lucratif permettant de référencer et découvrir des boissons alcoolisées du monde entier.
          Le site n'a aucune vocation commerciale et ne vend aucun produit.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-800 mb-3">2. Responsabilité</h2>
        <p>
          Les informations (descriptions, degrés d'alcool, origines) sont fournies à titre indicatif par la communauté.
          L'éditeur du site ne saurait être tenu responsable des erreurs, omissions, ou d'une utilisation inappropriée des informations présentes sur le site.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-800 mb-3">3. Contenu Utilisateur (Photos & Textes)</h2>
        <p class="mb-2">En proposant une boisson sur Open Bar, vous vous engagez à :</p>
        <ul class="list-disc pl-5 space-y-1 mb-2">
          <li>Être l'auteur de la photo ou disposer des droits nécessaires pour sa diffusion.</li>
          <li>Ne pas publier de contenu haineux, diffamatoire ou illégal.</li>
          <li>Accorder à Open Bar une licence gratuite et non exclusive pour afficher ce contenu sur le site.</li>
        </ul>
        <p class="text-sm italic">Tout contenu jugé inapproprié pourra être supprimé sans préavis par l'administration.</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-800 mb-3">4. Données Personnelles</h2>
        <p>
          Ce site respecte votre vie privée. Aucune donnée personnelle n'est revendue à des tiers.
          Les cookies utilisés servent uniquement au bon fonctionnement technique du site.
        </p>
      </section>
    </div>
  </div>
</template>