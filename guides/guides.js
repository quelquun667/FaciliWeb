// Filtrage des guides par recherche

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const input  = document.getElementById('guides-search');
  const cards  = document.querySelectorAll('.guide-card');
  const noRes  = document.createElement('p');
  noRes.className = 'annuaire-no-result';
  noRes.hidden    = true;
  noRes.textContent = 'Aucun guide ne correspond à votre recherche.';
  document.getElementById('guides-container').after(noRes);

  input.addEventListener('input', () => {
    const query = normalize(input.value.trim());
    let visible = 0;
    cards.forEach((card) => {
      const haystack = normalize((card.dataset.keywords || '') + ' ' + card.textContent);
      const match    = !query || haystack.includes(query);
      card.hidden    = !match;
      if (match) visible++;
    });
    noRes.hidden = visible > 0;
  });
});

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/̀-ͯ/g, '');
}
