// Annuaire des services publics — filtrage par recherche

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});

/**
 * Active le filtrage en direct des services selon le texte saisi.
 */
function initSearch() {
  const input = document.getElementById('annuaire-search');
  const noResult = document.getElementById('annuaire-no-result');
  const cards = document.querySelectorAll('.service-card');
  const categories = document.querySelectorAll('.annuaire-category');

  if (!input) return;

  input.addEventListener('input', () => {
    const query = normalize(input.value.trim());
    let visibleCount = 0;

    // Filtre les cartes une par une selon les mots-clés et le contenu textuel
    cards.forEach((card) => {
      if (!query) {
        card.hidden = false;
        visibleCount++;
        return;
      }
      const haystack = normalize(
        (card.dataset.keywords || '') + ' ' + card.textContent
      );
      const matches = haystack.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount++;
    });

    // Cache une catégorie si aucune carte visible à l'intérieur
    categories.forEach((cat) => {
      const visibleCards = cat.querySelectorAll('.service-card:not([hidden])');
      cat.hidden = visibleCards.length === 0;
    });

    noResult.hidden = visibleCount > 0;
  });
}

/**
 * Normalise une chaîne pour la recherche : minuscules, sans accents.
 * Utilise une plage Unicode explicite (U+0300 à U+036F) pour les diacritiques.
 * @param {string} text
 * @returns {string}
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
