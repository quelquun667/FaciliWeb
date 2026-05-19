// Tutoriel de premier démarrage — FaciliWeb

'use strict';

const TOTAL_SLIDES = 9; // 0 à 8
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', () => {
  buildDots();
  goToSlide(0);

  document.getElementById('btn-next').addEventListener('click', () => {
    if (currentSlide < TOTAL_SLIDES - 1) goToSlide(currentSlide + 1);
  });

  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  });

  document.getElementById('btn-finish').addEventListener('click', () => {
    window.close();
  });

  // Navigation clavier (flèches)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentSlide < TOTAL_SLIDES - 1) goToSlide(currentSlide + 1);
    if (e.key === 'ArrowLeft'  && currentSlide > 0)                goToSlide(currentSlide - 1);
  });
});

function buildDots() {
  const container = document.getElementById('ob-dots');
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('button');
    dot.className = 'ob-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Étape ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    container.appendChild(dot);
  }
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.ob-slide');
  const dots   = document.querySelectorAll('.ob-dot');
  const fill   = document.getElementById('ob-progress-fill');
  const prev   = document.getElementById('btn-prev');
  const next   = document.getElementById('btn-next');

  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === index);
    d.setAttribute('aria-selected', String(i === index));
  });

  const pct = index === 0 ? 0 : Math.round((index / (TOTAL_SLIDES - 1)) * 100);
  fill.style.width = pct + '%';
  fill.parentElement.setAttribute('aria-valuenow', pct);

  prev.disabled = index === 0;

  const isLast = index === TOTAL_SLIDES - 1;
  next.hidden = isLast;

  currentSlide = index;
}
