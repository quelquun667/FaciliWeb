// Script de fond (Service Worker) — gestion de la sécurité et des événements globaux

'use strict';

// ─── Vérification de mise à jour ──────────────────────────────────────────

const GITHUB_RELEASES_API =
  'https://api.github.com/repos/quelquun667/FaciliWeb/releases/latest';
// Délai minimum entre deux vérifications automatiques (1 heure)
const UPDATE_CHECK_COOLDOWN = 60 * 60 * 1000;

/**
 * Vérifie si une nouvelle version est disponible sur GitHub.
 * Stocke le résultat dans chrome.storage.local.
 * Le cooldown évite de spammer l'API GitHub.
 * @param {boolean} force - Ignore le cooldown (vérification manuelle depuis les paramètres).
 */
async function checkForUpdates(force = false) {
  try {
    const stored = await chrome.storage.local.get({ lastUpdateCheck: 0 });
    if (!force && Date.now() - stored.lastUpdateCheck < UPDATE_CHECK_COOLDOWN) return;

    const response = await fetch(GITHUB_RELEASES_API, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!response.ok) return;

    const data = await response.json();
    const latestVersion  = (data.tag_name || '').replace(/^v/, '');
    const currentVersion = chrome.runtime.getManifest().version;
    const isNewer = compareVersions(latestVersion, currentVersion) > 0;

    await chrome.storage.local.set({
      lastUpdateCheck: Date.now(),
      updateAvailable: isNewer,
      latestVersion,
      releaseUrl: data.html_url || ''
    });

    // Si c'est une vérification manuelle, notifie la popup via un message
    if (force) {
      chrome.runtime.sendMessage({ action: 'updateCheckDone', isNewer, latestVersion }).catch(() => {});
    }
  } catch {
    // Réseau indisponible — on ne touche pas aux données existantes
  }
}

/**
 * Compare deux chaînes de version sémantique.
 * Retourne 1 si a > b, -1 si a < b, 0 si égaux.
 */
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return 1;
    if ((pa[i] || 0) < (pb[i] || 0)) return -1;
  }
  return 0;
}

// ─── Liste noire phishing ──────────────────────────────────────────────────

// Liste de secours intégrée (utilisée si la mise à jour distante échoue)
const PHISHING_FALLBACK = [
  'paypa1.com', 'arnaquebanque.fr', 'secure-login-update.com',
  'compte-suspendu.fr', 'verification-identite.net', 'impots-remboursement.fr',
  'amazon-security-alert.com', 'netflix-billing-update.com', 'apple-id-locked.com',
  'microsoft-support-alert.com', 'caf-allocation-versement.fr', 'ameli-remboursement.net',
  'free-gift-winner.com', 'urgent-colis-bloque.fr', 'banque-securite-alerte.com'
];

// URL de la liste publique de phishing mise à jour fréquemment
// Source : Phishing.Database (github.com/mitchellkrogza)
const PHISHING_FEED_URL =
  'https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-domains-ACTIVE.txt';

const ALARM_PHISHING_UPDATE = 'faciliweb-phishing-update';

// Set en mémoire (reconstruit depuis le stockage au démarrage du worker)
let phishingSet = null;

/**
 * Retourne le Set des domaines suspects (depuis la mémoire ou le stockage).
 */
async function getPhishingSet() {
  if (phishingSet) return phishingSet;
  const result = await chrome.storage.local.get({ phishingList: null });
  const list = result.phishingList || PHISHING_FALLBACK;
  phishingSet = new Set(list);
  return phishingSet;
}

/**
 * Télécharge la liste de phishing distante, la parse et la stocke.
 * Conserve la liste précédente en cas d'échec.
 */
async function updatePhishingList() {
  try {
    const response = await fetch(PHISHING_FEED_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();

    // Une ligne = un domaine. Filtre les lignes vides et les commentaires.
    const domains = text
      .split('\n')
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l && !l.startsWith('#'));

    if (domains.length < 100) throw new Error('Liste trop courte — probablement une erreur réseau');

    // Limite la taille pour éviter de saturer le stockage (max 50 000 entrées)
    const trimmed = domains.slice(0, 50_000);
    await chrome.storage.local.set({ phishingList: trimmed, phishingUpdatedAt: Date.now() });
    phishingSet = new Set(trimmed);
    console.log(`FaciliWeb : liste phishing mise à jour (${trimmed.length} domaines)`);
  } catch (err) {
    console.warn('FaciliWeb : mise à jour phishing échouée, liste conservée.', err.message);
  }
}

// Vérifie si un domaine (sans www.) est dans la liste noire
async function isDomainBlacklisted(domain) {
  const set = await getPhishingSet();
  // Vérifie le domaine exact ET ses sous-domaines
  if (set.has(domain)) return true;
  const parts = domain.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    if (set.has(parts.slice(i).join('.'))) return true;
  }
  return false;
}

// Liste des domaines "canoniques" à comparer pour la détection de fautes de frappe
const CANONICAL_DOMAINS = [
  // Géants du web
  'google.com', 'google.fr', 'youtube.com', 'facebook.com', 'instagram.com',
  'twitter.com', 'x.com', 'linkedin.com', 'whatsapp.com', 'tiktok.com',
  // Commerce
  'amazon.fr', 'amazon.com', 'cdiscount.com', 'fnac.com', 'leboncoin.fr',
  'vinted.fr', 'ebay.fr',
  // Paiement
  'paypal.com', 'paypal.fr',
  // Streaming
  'netflix.com', 'disneyplus.com', 'spotify.com', 'deezer.com',
  // Tech
  'apple.com', 'microsoft.com', 'office.com', 'icloud.com',
  // Messagerie
  'gmail.com', 'outlook.com', 'orange.fr', 'free.fr', 'sfr.fr',
  // Services publics français
  'impots.gouv.fr', 'ameli.fr', 'caf.fr', 'service-public.fr', 'laposte.fr',
  'pole-emploi.fr', 'francetravail.fr', 'ants.gouv.fr', 'cpam.fr',
  'urssaf.fr', 'info-retraite.fr',
  // Banques françaises
  'bnpparibas.fr', 'credit-agricole.fr', 'societegenerale.fr', 'lcl.fr',
  'creditmutuel.fr', 'caisse-epargne.fr', 'banquepopulaire.fr',
  'labanquepostale.fr', 'boursorama.com', 'fortuneo.fr', 'hellobank.fr'
];

// URL de l'icône utilisée pour les notifications système
const NOTIFICATION_ICON = 'assets/icon128.png';

// Identifiants des alarmes utilisées par l'extension
const ALARM_BREAK_TIMER    = 'faciliweb-break-timer';
const ALARM_WEEKLY_SUMMARY = 'faciliweb-weekly-summary';

// Initialisation lors de l'installation ou de la mise à jour de l'extension
chrome.runtime.onInstalled.addListener((details) => {
  setupContextMenu();
  initDefaultSettings();
  scheduleWeeklySummary();
  schedulePhishingUpdate();
  restoreBreakTimerIfEnabled();
  updatePhishingList(); // première récupération immédiate

  // Ouvre le tutoriel uniquement lors de la toute première installation
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding/onboarding.html') });
  }
});

// Restauration des alarmes au redémarrage du navigateur
chrome.runtime.onStartup.addListener(() => {
  scheduleWeeklySummary();
  schedulePhishingUpdate();
  restoreBreakTimerIfEnabled();
  checkForUpdates(); // vérification silencieuse de mise à jour
});

/**
 * Planifie la mise à jour automatique de la liste phishing toutes les 6 heures.
 */
function schedulePhishingUpdate() {
  chrome.alarms.get(ALARM_PHISHING_UPDATE, (existing) => {
    if (!existing) {
      chrome.alarms.create(ALARM_PHISHING_UPDATE, {
        delayInMinutes: 60 * 6,
        periodInMinutes: 60 * 6
      });
    }
  });
}

/**
 * Crée l'option "Analyser ce lien" dans le menu contextuel (clic droit).
 * Utilise removeAll() pour éviter l'erreur "duplicate ID" lors d'une mise à jour.
 */
function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'analyzeLinkFaciliWeb',
      title: chrome.i18n.getMessage('contextMenuAnalyzeLink'),
      contexts: ['link']
    });
  });
}

/**
 * Initialise les paramètres par défaut si absents du stockage local.
 */
function initDefaultSettings() {
  chrome.storage.local.get(['capsLockEnabled'], (result) => {
    if (result.capsLockEnabled === undefined) {
      chrome.storage.local.set({
        capsLockEnabled: true,
        highlightEnabled: false,
        specialCharsEnabled: true,
        phishingEnabled: true,
        jargonEnabled: true,
        attachmentCheckerEnabled: true,
        captchaDetectorEnabled: true,
        typoDetectorEnabled: true,
        autofillEnabled: true,
        breakTimerEnabled: false,
        breakTimerMinutes: 30,
        weeklySummaryEnabled: true,
        language: 'fr'
      });
    }
  });
}

// Écoute du clic sur le menu contextuel pour analyser un lien
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeLinkFaciliWeb' && info.linkUrl) {
    analyzeLinkAndNotify(info.linkUrl, tab.id);
  }
});

/**
 * Analyse un lien et envoie le résultat au content script de l'onglet.
 * @param {string} url - L'URL du lien à analyser.
 * @param {number} tabId - L'ID de l'onglet courant.
 */
async function analyzeLinkAndNotify(url, tabId) {
  let domain = null;
  try {
    domain = new URL(url).hostname.toLowerCase();
  } catch {
    return;
  }

  const isSuspicious = await isDomainBlacklisted(domain);

  const message = isSuspicious
    ? `${chrome.i18n.getMessage('linkAnalysisDanger')}\n${domain}`
    : `${chrome.i18n.getMessage('linkAnalysisSafe')}\n${domain}`;

  safeSendMessage(tabId, { action: 'showLinkAnalysis', isSuspicious, domain, message });
}

/**
 * Envoie un message à un onglet sans lever d'erreur si le destinataire est absent.
 * @param {number} tabId
 * @param {Object} message
 */
function safeSendMessage(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, () => {
    // Lit chrome.runtime.lastError pour éviter une erreur non gérée
    void chrome.runtime.lastError;
  });
}

// Écoute des changements d'URL pour détecter sites suspects + fautes de frappe
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  // Ignore les URL internes du navigateur
  if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) return;

  let domain = null;
  try {
    domain = new URL(tab.url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return;
  }

  chrome.storage.local.get(
    { phishingEnabled: true, typoDetectorEnabled: true },
    async (settings) => {
      // Vérification anti-phishing (asynchrone — utilise le Set en mémoire)
      if (settings.phishingEnabled) {
        const isSuspicious = await isDomainBlacklisted(domain);
        if (isSuspicious) {
          safeSendMessage(tabId, { action: 'showDangerZone', domain });
          return;
        }
      }

      // Vérification orthographique du domaine
      if (settings.typoDetectorEnabled) {
        const suggestion = findClosestCanonicalDomain(domain);
        if (suggestion) {
          safeSendMessage(tabId, {
            action: 'showTypoSuggestion',
            currentDomain: domain,
            suggestion
          });
        }
      }
    }
  );
});

// ─── Détecteur de faute de frappe dans un domaine ─────────────────────────

/**
 * Cherche le domaine canonique le plus proche du domaine fourni.
 * Retourne null si le domaine est déjà canonique ou trop éloigné.
 * @param {string} domain - Domaine à comparer (sans "www.").
 * @returns {string|null}
 */
function findClosestCanonicalDomain(domain) {
  // Pas de suggestion si le domaine est déjà connu
  if (CANONICAL_DOMAINS.includes(domain)) return null;

  // Ne pas signaler les domaines très courts (trop de faux positifs)
  if (domain.length < 5) return null;

  let bestMatch = null;
  let bestDistance = Infinity;

  for (const canonical of CANONICAL_DOMAINS) {
    // Seuil de différence de longueur — limite les comparaisons inutiles
    if (Math.abs(canonical.length - domain.length) > 2) continue;

    const distance = levenshteinDistance(domain, canonical);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = canonical;
    }
  }

  // Suggestion seulement si la distance est 1 ou 2 (proche mais pas identique)
  if (bestMatch && bestDistance >= 1 && bestDistance <= 2) {
    return bestMatch;
  }
  return null;
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes (nombre d'éditions).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Optimisation mémoire : on garde seulement deux lignes de la matrice
  let previous = new Array(b.length + 1);
  let current = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) previous[j] = j;

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,       // insertion
        previous[j] + 1,          // suppression
        previous[j - 1] + cost    // substitution
      );
    }
    [previous, current] = [current, previous];
  }

  return previous[b.length];
}

// ─── Écoute des messages depuis la popup ou les content scripts ──────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getBlacklist') {
    sendResponse({ blacklist: PHISHING_FALLBACK });
    return false;
  }
  if (message.action === 'checkForUpdates') {
    checkForUpdates(true);
    return false;
  }
  if (message.action === 'startBreakTimer') {
    startBreakTimer(message.minutes);
    sendResponse({ ok: true });
    return false;
  }
  if (message.action === 'stopBreakTimer') {
    stopBreakTimer();
    sendResponse({ ok: true });
    return false;
  }
  if (message.action === 'triggerWeeklySummary') {
    // Permet de tester la génération du résumé hebdomadaire à la demande
    generateAndStoreWeeklySummary().then(() => sendResponse({ ok: true }));
    return true;
  }
  return false;
});

// ─── Minuterie de pause écran ─────────────────────────────────────────────

/**
 * Démarre une alarme récurrente qui rappelle de faire une pause.
 * @param {number} minutes - Durée entre deux rappels.
 */
function startBreakTimer(minutes) {
  const duration = Math.max(1, Math.min(240, Number(minutes) || 30));
  chrome.alarms.create(ALARM_BREAK_TIMER, {
    delayInMinutes: duration,
    periodInMinutes: duration
  });
  chrome.storage.local.set({ breakTimerEnabled: true, breakTimerMinutes: duration });
}

/**
 * Arrête l'alarme de pause écran.
 */
function stopBreakTimer() {
  chrome.alarms.clear(ALARM_BREAK_TIMER);
  chrome.storage.local.set({ breakTimerEnabled: false });
}

/**
 * Restaure l'alarme de pause au démarrage si l'utilisateur l'avait activée.
 */
function restoreBreakTimerIfEnabled() {
  chrome.storage.local.get(
    { breakTimerEnabled: false, breakTimerMinutes: 30 },
    (result) => {
      if (result.breakTimerEnabled) {
        chrome.alarms.create(ALARM_BREAK_TIMER, {
          delayInMinutes: result.breakTimerMinutes,
          periodInMinutes: result.breakTimerMinutes
        });
      }
    }
  );
}

// ─── Résumé de semaine ────────────────────────────────────────────────────

/**
 * Programme l'alarme hebdomadaire (toutes les 7 jours, à partir de 1 min après l'installation).
 */
function scheduleWeeklySummary() {
  chrome.alarms.get(ALARM_WEEKLY_SUMMARY, (existing) => {
    if (!existing) {
      chrome.alarms.create(ALARM_WEEKLY_SUMMARY, {
        delayInMinutes: 60 * 24 * 7,
        periodInMinutes: 60 * 24 * 7
      });
    }
  });
}

/**
 * Calcule les 3 domaines les plus visités sur les 7 derniers jours
 * et enregistre le résumé dans le stockage local.
 */
function generateAndStoreWeeklySummary() {
  return new Promise((resolve) => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    chrome.history.search({ text: '', startTime: sevenDaysAgo, maxResults: 1000 }, (items) => {
      // Compte le nombre de visites par domaine
      const domainCounts = {};
      for (const item of items) {
        if (!item.url) continue;
        let domain = '';
        try {
          domain = new URL(item.url).hostname.toLowerCase();
        } catch {
          continue;
        }
        if (!domain || item.url.startsWith('chrome://')) continue;
        const visits = item.visitCount || 1;
        domainCounts[domain] = (domainCounts[domain] || 0) + visits;
      }

      // Trie par fréquence décroissante et garde le top 3
      const top3 = Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([domain, count]) => ({ domain, count }));

      const summary = {
        generatedAt: Date.now(),
        weekStartTime: sevenDaysAgo,
        top: top3
      };

      chrome.storage.local.set({ weeklySummary: summary }, () => {
        showWeeklySummaryNotification(top3);
        resolve(summary);
      });
    });
  });
}

/**
 * Affiche une notification système avec le top 3 des sites de la semaine.
 * @param {Array<{domain: string, count: number}>} top3
 */
function showWeeklySummaryNotification(top3) {
  if (top3.length === 0) return;
  const lines = top3.map((t, i) => `${i + 1}. ${t.domain} (${t.count})`).join('\n');
  chrome.notifications.create({
    type: 'basic',
    iconUrl: NOTIFICATION_ICON,
    title: '📊 FaciliWeb — Votre semaine',
    message: `Vos sites les plus visités :\n${lines}`,
    priority: 1
  });
}

// ─── Déclenchement des alarmes ────────────────────────────────────────────

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_PHISHING_UPDATE) {
    updatePhishingList();
  }
  if (alarm.name === ALARM_BREAK_TIMER) {
    chrome.storage.local.get({ breakTimerMinutes: 30 }, (result) => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: NOTIFICATION_ICON,
        title: '⏰ FaciliWeb — Pause recommandée',
        message: `Vous naviguez depuis ${result.breakTimerMinutes} minutes. Pensez à faire une pause, à regarder au loin et à vous étirer !`,
        priority: 2,
        requireInteraction: true
      });
    });
  }
  if (alarm.name === ALARM_WEEKLY_SUMMARY) {
    chrome.storage.local.get({ weeklySummaryEnabled: true }, (result) => {
      if (result.weeklySummaryEnabled) generateAndStoreWeeklySummary();
    });
  }
});
