// Logique de la popup FaciliWeb (onglets, paramètres, thème, outils)

'use strict';

const STORAGE_KEY_NOTES = 'faciliweb_notes';
const HISTORY_MAX_ITEMS = 10;
let notesSaveTimer = null;
let toastTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initThemeToggle();
  loadUrlDecomposition();
  loadWeeklySummary();
  loadSimplifiedHistory();
  initNotes();
  initBreakTimer();
  initBreachCheck();
  initQuickActions();
  initAllSettings();
  initResetButton();
});

// ─── Onglets ──────────────────────────────────────────────────────────────

/**
 * Active le système d'onglets : affiche le panneau correspondant à l'onglet cliqué.
 */
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });
      panels.forEach((p) => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });
}

// ─── Thème sombre/clair ───────────────────────────────────────────────────

/**
 * Bascule entre thème clair et sombre via le bouton de l'en-tête.
 * Le toggle des paramètres est synchronisé via la même clé `darkMode`.
 */
function initThemeToggle() {
  const headerBtn = document.getElementById('btn-theme-toggle');
  const settingToggle = document.getElementById('setting-theme');

  chrome.storage.local.get({ darkMode: false }, (result) => {
    applyTheme(result.darkMode);
    if (settingToggle) settingToggle.setAttribute('aria-checked', String(result.darkMode));
  });

  headerBtn.addEventListener('click', () => {
    chrome.storage.local.get({ darkMode: false }, (result) => {
      const newMode = !result.darkMode;
      chrome.storage.local.set({ darkMode: newMode, theme: newMode ? 'dark' : 'light' }, () => {
        applyTheme(newMode);
        if (settingToggle) settingToggle.setAttribute('aria-checked', String(newMode));
      });
    });
  });
}

/**
 * Applique visuellement le thème en modifiant l'attribut HTML data-theme.
 */
function applyTheme(isDark) {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  const headerBtn = document.getElementById('btn-theme-toggle');
  if (headerBtn) headerBtn.textContent = isDark ? '☀️' : '🌙';
}

// ─── Décomposition de l'URL courante ──────────────────────────────────────

function loadUrlDecomposition() {
  const container = document.getElementById('url-decomp');
  if (!container) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.url) return renderUrlFallback(container, 'Aucune adresse à analyser.');
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      return renderUrlFallback(container, 'Page interne du navigateur.');
    }
    renderUrlDecomposition(container, tab.url);
  });
}

function renderUrlFallback(container, message) {
  container.textContent = '';
  const p = document.createElement('p');
  p.className = 'url-decomp-fallback';
  p.textContent = message;
  container.appendChild(p);
}

function renderUrlDecomposition(container, url) {
  container.textContent = '';

  let parsed;
  try { parsed = new URL(url); } catch { return renderUrlFallback(container, 'Adresse non analysable.'); }

  const hostnameParts = parsed.hostname.split('.');
  const tld = hostnameParts.length > 0 ? hostnameParts.pop() : '';
  const mainDomain = hostnameParts.length > 0 ? hostnameParts.pop() : '';
  const subdomain = hostnameParts.join('.');

  const segments = [
    {
      text: parsed.protocol + '//',
      type: parsed.protocol === 'https:' ? 'safe' : 'warning',
      label: parsed.protocol === 'https:' ? 'Protocole sécurisé' : 'Protocole NON sécurisé',
      help: parsed.protocol === 'https:'
        ? 'Connexion chiffrée : vos données sont protégées.'
        : '⚠️ Connexion non chiffrée. Évitez d\'y saisir des informations sensibles.'
    }
  ];
  if (subdomain) segments.push({ text: subdomain + '.', type: 'subdomain', label: 'Sous-domaine', help: 'Section du site (ex. www, mail). Ne donne pas l\'identité du site.' });
  segments.push({ text: mainDomain, type: 'domain', label: 'Nom du site (le plus important)', help: '👉 C\'est cette partie qu\'il faut vérifier avant de faire confiance.' });
  segments.push({ text: '.' + tld, type: 'tld', label: 'Extension', help: 'Type ou pays du site (.fr, .com, .gouv.fr...).' });
  if (parsed.pathname && parsed.pathname !== '/') segments.push({ text: parsed.pathname, type: 'path', label: 'Chemin', help: 'Page précise consultée.' });
  if (parsed.search) segments.push({ text: parsed.search, type: 'query', label: 'Paramètres', help: 'Infos supplémentaires envoyées au site.' });

  const urlLine = document.createElement('div');
  urlLine.className = 'url-decomp-line';
  segments.forEach((seg) => {
    const span = document.createElement('span');
    span.className = `url-segment url-segment-${seg.type}`;
    span.textContent = seg.text;
    span.title = `${seg.label} — ${seg.help}`;
    span.tabIndex = 0;
    urlLine.appendChild(span);
  });
  container.appendChild(urlLine);

  const legend = document.createElement('ul');
  legend.className = 'url-decomp-legend';
  segments.forEach((seg) => {
    const li = document.createElement('li');
    li.className = 'url-legend-item';
    const dot = document.createElement('span');
    dot.className = `url-legend-dot url-segment-${seg.type}`;
    const label = document.createElement('span');
    label.className = 'url-legend-label';
    label.textContent = seg.label;
    const help = document.createElement('span');
    help.className = 'url-legend-help';
    help.textContent = seg.help;
    li.appendChild(dot);
    li.appendChild(label);
    li.appendChild(help);
    legend.appendChild(li);
  });
  container.appendChild(legend);
}

// ─── Résumé hebdomadaire ──────────────────────────────────────────────────

function loadWeeklySummary() {
  const container = document.getElementById('weekly-summary');
  if (!container) return;

  chrome.storage.local.get({ weeklySummary: null }, (result) => {
    container.textContent = '';
    if (!result.weeklySummary || !result.weeklySummary.top || result.weeklySummary.top.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'weekly-empty';
      empty.textContent = 'Pas encore de résumé.';
      container.appendChild(empty);
      const genBtn = document.createElement('button');
      genBtn.className = 'btn btn-secondary btn-small';
      genBtn.textContent = '📊 Générer maintenant';
      genBtn.addEventListener('click', () => {
        genBtn.disabled = true;
        chrome.runtime.sendMessage({ action: 'triggerWeeklySummary' }, () => {
          void chrome.runtime.lastError;
          loadWeeklySummary();
        });
      });
      container.appendChild(genBtn);
      return;
    }

    const date = new Date(result.weeklySummary.generatedAt);
    const dateText = document.createElement('p');
    dateText.className = 'weekly-date';
    dateText.textContent = `Résumé du ${date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}`;
    container.appendChild(dateText);

    const list = document.createElement('ol');
    list.className = 'weekly-list';
    const medals = ['🥇', '🥈', '🥉'];
    result.weeklySummary.top.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'weekly-item';
      const medal = document.createElement('span');
      medal.className = 'weekly-medal';
      medal.textContent = medals[index] || '•';
      const dom = document.createElement('span');
      dom.className = 'weekly-domain';
      dom.textContent = item.domain;
      const cnt = document.createElement('span');
      cnt.className = 'weekly-count';
      cnt.textContent = `${item.count} visites`;
      li.appendChild(medal); li.appendChild(dom); li.appendChild(cnt);
      list.appendChild(li);
    });
    container.appendChild(list);
  });
}

// ─── Historique simplifié ─────────────────────────────────────────────────

function loadSimplifiedHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;
  const oneDayAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  chrome.history.search({ text: '', startTime: oneDayAgo, maxResults: 50 }, (items) => {
    const seen = new Set();
    const unique = [];
    for (const it of items) {
      if (!it.url || it.url.startsWith('chrome://') || it.url.startsWith('edge://')) continue;
      let dom;
      try { dom = new URL(it.url).hostname; } catch { continue; }
      if (!seen.has(dom)) { seen.add(dom); unique.push(it); }
      if (unique.length >= HISTORY_MAX_ITEMS) break;
    }

    container.textContent = '';
    if (unique.length === 0) {
      const p = document.createElement('p');
      p.className = 'history-empty';
      p.textContent = 'Aucun site récent.';
      container.appendChild(p);
      return;
    }
    unique.forEach((it) => container.appendChild(createHistoryEntry(it)));
  });
}

function createHistoryEntry(item) {
  let dom; try { dom = new URL(item.url).hostname; } catch { dom = item.url; }
  const display = item.title && item.title.trim() ? item.title : dom;
  const date = item.lastVisitTime
    ? new Date(item.lastVisitTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : '';

  const entry = document.createElement('div');
  entry.className = 'history-entry';

  const fav = document.createElement('img');
  fav.className = 'history-favicon';
  fav.width = 20; fav.height = 20; fav.alt = '';
  const favUrl = new URL(chrome.runtime.getURL('/_favicon/'));
  favUrl.searchParams.set('pageUrl', item.url);
  favUrl.searchParams.set('size', '32');
  fav.src = favUrl.toString();
  fav.onerror = () => { fav.removeAttribute('src'); fav.classList.add('history-favicon-fallback'); };

  const info = document.createElement('div');
  info.className = 'history-entry-info';
  const name = document.createElement('span');
  name.className = 'history-entry-name';
  name.textContent = display.length > 36 ? display.slice(0, 34) + '…' : display;
  name.title = display;
  const dEl = document.createElement('span');
  dEl.className = 'history-entry-domain';
  dEl.textContent = dom;
  info.appendChild(name); info.appendChild(dEl);

  const meta = document.createElement('div');
  meta.className = 'history-entry-meta';
  const dateEl = document.createElement('span');
  dateEl.className = 'history-entry-date';
  dateEl.textContent = date;
  const openBtn = document.createElement('button');
  openBtn.className = 'btn-icon-small';
  openBtn.textContent = '↗';
  openBtn.setAttribute('aria-label', `Ouvrir ${display}`);
  openBtn.addEventListener('click', () => chrome.tabs.create({ url: item.url }));
  meta.appendChild(dateEl); meta.appendChild(openBtn);

  entry.appendChild(fav); entry.appendChild(info); entry.appendChild(meta);
  return entry;
}

// ─── Carnet de notes ──────────────────────────────────────────────────────

function initNotes() {
  const textarea = document.getElementById('notes-textarea');
  const status = document.getElementById('notes-status');
  const clearBtn = document.getElementById('btn-notes-clear');
  if (!textarea) return;

  chrome.storage.local.get({ [STORAGE_KEY_NOTES]: '' }, (r) => { textarea.value = r[STORAGE_KEY_NOTES]; });

  textarea.addEventListener('input', () => {
    status.textContent = '✏️ Sauvegarde...';
    status.className = 'notes-status saving';
    if (notesSaveTimer) clearTimeout(notesSaveTimer);
    notesSaveTimer = setTimeout(() => {
      chrome.storage.local.set({ [STORAGE_KEY_NOTES]: textarea.value }, () => {
        status.textContent = '✅ Enregistré';
        status.className = 'notes-status saved';
        setTimeout(() => { status.textContent = ''; status.className = 'notes-status'; }, 1500);
      });
    }, 400);
  });

  clearBtn.addEventListener('click', () => {
    if (!textarea.value || !window.confirm('Vider votre carnet de notes ?')) return;
    textarea.value = '';
    chrome.storage.local.set({ [STORAGE_KEY_NOTES]: '' });
  });
}

// ─── Minuterie de pause ───────────────────────────────────────────────────

function initBreakTimer() {
  const input = document.getElementById('break-timer-input');
  const btn = document.getElementById('btn-break-toggle');
  const status = document.getElementById('break-timer-status');
  if (!input || !btn || !status) return;

  chrome.storage.local.get({ breakTimerEnabled: false, breakTimerMinutes: 30 }, (s) => {
    input.value = s.breakTimerMinutes;
    updateBreakTimerUI(s.breakTimerEnabled, s.breakTimerMinutes);
  });

  btn.addEventListener('click', () => {
    chrome.storage.local.get({ breakTimerEnabled: false }, (s) => {
      if (s.breakTimerEnabled) {
        chrome.runtime.sendMessage({ action: 'stopBreakTimer' }, () => {
          void chrome.runtime.lastError;
          updateBreakTimerUI(false, Number(input.value) || 30);
        });
      } else {
        const minutes = Math.max(1, Math.min(240, Number(input.value) || 30));
        chrome.runtime.sendMessage({ action: 'startBreakTimer', minutes }, () => {
          void chrome.runtime.lastError;
          updateBreakTimerUI(true, minutes);
        });
      }
    });
  });

  input.addEventListener('change', () => {
    const minutes = Math.max(1, Math.min(240, Number(input.value) || 30));
    input.value = minutes;
    chrome.storage.local.set({ breakTimerMinutes: minutes });
  });
}

function updateBreakTimerUI(isEnabled, minutes) {
  const status = document.getElementById('break-timer-status');
  const btn = document.getElementById('btn-break-toggle');
  if (isEnabled) {
    status.textContent = `✅ Activée — toutes les ${minutes} min`;
    status.className = 'status-badge active';
    btn.textContent = '⏹ Désactiver';
    btn.classList.replace('btn-primary', 'btn-secondary');
  } else {
    status.textContent = 'Désactivée';
    status.className = 'status-badge';
    btn.textContent = '▶ Activer';
    btn.classList.replace('btn-secondary', 'btn-primary');
  }
}

// ─── Alerte fuite de données ──────────────────────────────────────────────

/**
 * Permet à l'utilisateur de vérifier si son email apparaît dans une fuite de données
 * connue via le service public HaveIBeenPwned (en ouvrant la page dédiée).
 * Nous ne soumettons jamais l'email sans validation explicite.
 */
function initBreachCheck() {
  const input = document.getElementById('breach-input');
  const btn = document.getElementById('btn-breach-check');
  const result = document.getElementById('breach-result');
  if (!input || !btn || !result) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    result.textContent = '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      result.style.color = 'var(--fw-red)';
      result.textContent = '⚠️ Adresse email invalide.';
      return;
    }

    result.style.color = 'var(--fw-text)';
    result.innerHTML = '';

    const info = document.createElement('p');
    info.textContent = 'Nous ouvrons la page sécurisée du service public HaveIBeenPwned, géré par un expert mondial en cybersécurité.';
    result.appendChild(info);

    // Délai très court pour laisser à l'utilisateur le temps de lire avant ouverture
    setTimeout(() => {
      const url = `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`;
      chrome.tabs.create({ url });
    }, 300);
  });
}

// ─── Boutons d'actions rapides ────────────────────────────────────────────

function initQuickActions() {
  const map = {
    'btn-passwords': 'passwords/passwords.html',
    'btn-annuaire': 'annuaire/annuaire.html',
    'btn-glossary': 'glossary/glossary.html',
    'btn-help': 'help/help.html',
    'btn-shortcuts': 'shortcuts/shortcuts.html',
    'btn-guides': 'guides/guides.html'
  };
  Object.entries(map).forEach(([id, path]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      // Pour la page identifiants, transmet l'URL de l'onglet actif via un
      // paramètre afin que le formulaire d'ajout puisse pré-remplir le site.
      if (id === 'btn-passwords') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const url = chrome.runtime.getURL(path);
          const sourceUrl = (tabs[0] && tabs[0].url) || '';
          const fullUrl = sourceUrl
            ? `${url}?from=${encodeURIComponent(sourceUrl)}`
            : url;
          chrome.tabs.create({ url: fullUrl });
        });
        return;
      }
      chrome.tabs.create({ url: chrome.runtime.getURL(path) });
    });
  });
}

// ─── Paramètres (toggles, langue, durée par défaut) ───────────────────────

const SETTING_KEYS = [
  'capsLockEnabled', 'highlightEnabled', 'specialCharsEnabled', 'jargonEnabled',
  'phishingEnabled', 'typoDetectorEnabled', 'attachmentCheckerEnabled',
  'captchaDetectorEnabled', 'autofillEnabled', 'weeklySummaryEnabled', 'darkMode'
];

function initAllSettings() {
  // Toggles désactivés par défaut (peuvent générer des conflits visuels)
  const offByDefault = new Set(['darkMode', 'highlightEnabled']);
  const defaults = SETTING_KEYS.reduce((acc, key) => {
    acc[key] = !offByDefault.has(key);
    return acc;
  }, { breakTimerMinutes: 30, language: 'fr' });

  chrome.storage.local.get(defaults, (settings) => {
    // Toggles génériques
    document.querySelectorAll('[data-setting]').forEach((toggle) => {
      const key = toggle.dataset.setting;
      const isChecked = !!settings[key];
      toggle.setAttribute('aria-checked', String(isChecked));
    });

    // Durée par défaut de la pause
    const breakDefault = document.getElementById('setting-break-default');
    if (breakDefault) breakDefault.value = settings.breakTimerMinutes;

    // Langue
    document.querySelectorAll('input[name="popup-language"]').forEach((r) => {
      r.checked = r.value === settings.language;
    });
  });

  // Écouteurs sur tous les toggles
  document.querySelectorAll('[data-setting]').forEach((toggle) => {
    const handler = () => onToggleClick(toggle);
    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handler(); }
    });
  });

  // Durée de pause par défaut
  const breakDefault = document.getElementById('setting-break-default');
  if (breakDefault) {
    breakDefault.addEventListener('change', () => {
      const minutes = Math.max(1, Math.min(240, Number(breakDefault.value) || 30));
      breakDefault.value = minutes;
      chrome.storage.local.set({ breakTimerMinutes: minutes }, () => showToast('Paramètres sauvegardés'));
    });
  }

  // Langue
  document.querySelectorAll('input[name="popup-language"]').forEach((r) => {
    r.addEventListener('change', () => {
      if (!r.checked) return;
      chrome.storage.local.set({ language: r.value }, () => showToast('Langue enregistrée (rechargez la page)'));
    });
  });
}

function onToggleClick(toggle) {
  const newState = toggle.getAttribute('aria-checked') !== 'true';
  const key = toggle.dataset.setting;
  toggle.setAttribute('aria-checked', String(newState));

  const update = { [key]: newState };
  // Synchronise darkMode avec la clé theme partagée
  if (key === 'darkMode') {
    update.theme = newState ? 'dark' : 'light';
    applyTheme(newState);
  }
  chrome.storage.local.set(update, () => showToast('Sauvegardé'));
}

// ─── Bouton de réinitialisation ───────────────────────────────────────────

function initResetButton() {
  const btn = document.getElementById('btn-reset-all');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!window.confirm('Réinitialiser FaciliWeb ? Tous vos identifiants, notes et paramètres seront supprimés.')) return;
    chrome.storage.local.clear(() => {
      showToast('🗑️ Tout a été réinitialisé');
      setTimeout(() => window.location.reload(), 800);
    });
  });
}

// ─── Notification toast ───────────────────────────────────────────────────

function showToast(message) {
  const toast = document.getElementById('save-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 1800);
}
