// Applique le thème (clair/sombre) à toutes les pages internes de l'extension
// avant le rendu, pour éviter le flash de couleur.

'use strict';

(function applyStoredTheme() {
  try {
    chrome.storage.local.get({ theme: 'light' }, (result) => {
      document.documentElement.dataset.theme = result.theme === 'dark' ? 'dark' : 'light';
    });
  } catch {
    // Hors contexte d'extension : aucune action requise.
  }
})();
