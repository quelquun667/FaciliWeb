// Script de contenu — injecté sur toutes les pages web

'use strict';

// Dictionnaire de termes techniques avec leurs définitions simplifiées
const JARGON_DICTIONARY = {
  'phishing': 'Tentative d\'arnaque : un faux site ou email essaie de voler vos informations.',
  'malware': 'Logiciel malveillant qui peut endommager votre ordinateur ou voler vos données.',
  'ransomware': 'Virus qui bloque votre ordinateur et réclame une rançon pour le débloquer.',
  'cookie': 'Petit fichier que le site enregistre sur votre appareil pour mémoriser vos préférences.',
  'https': 'Connexion sécurisée : vos données sont chiffrées entre vous et le site.',
  'vpn': 'Tunnel sécurisé qui masque votre adresse internet et protège votre connexion.',
  'firewall': 'Pare-feu : barrière qui bloque les accès non autorisés à votre ordinateur.',
  'spam': 'Messages non désirés, souvent publicitaires ou malveillants.',
  'authentification': 'Processus de vérification de votre identité avant d\'accéder à un service.',
  '2fa': 'Double vérification : en plus du mot de passe, un code est envoyé sur votre téléphone.',
  'chiffrement': 'Transformation des données en code illisible pour protéger leur confidentialité.',
  'virus': 'Programme malveillant qui se copie et endommage votre système.',
  'spyware': 'Logiciel espion qui surveille votre activité à votre insu.',
  'adware': 'Logiciel qui affiche des publicités non désirées sur votre écran.',
  'navigateur': 'Le programme que vous utilisez pour visiter des sites web (Chrome, Firefox, etc.).'
};

// Caractères spéciaux regroupés par catégorie pédagogique
const SPECIAL_CHARS_GROUPS = [
  {
    title: 'Symboles courants',
    chars: [
      { char: '@', hint: 'Alt Gr + à (0)' },
      { char: '€', hint: 'Alt Gr + E' },
      { char: '#', hint: 'Alt Gr + 3 (")' },
      { char: '%', hint: 'Maj + ù' },
      { char: '&', hint: 'Touche 1' },
      { char: '*', hint: 'Touche µ' },
      { char: '_', hint: 'Touche 8 (Maj)' },
      { char: '/', hint: 'Maj + : (point)' }
    ]
  },
  {
    title: 'Accents minuscules',
    chars: [
      { char: 'à', hint: 'Touche 0 (en haut)' },
      { char: 'â', hint: '^ (touche ¨) puis a' },
      { char: 'ä', hint: 'Maj + ^ puis a' },
      { char: 'é', hint: 'Touche 2' },
      { char: 'è', hint: 'Touche 7' },
      { char: 'ê', hint: '^ puis e' },
      { char: 'ë', hint: 'Maj + ^ puis e' },
      { char: 'î', hint: '^ puis i' },
      { char: 'ï', hint: 'Maj + ^ puis i' },
      { char: 'ô', hint: '^ puis o' },
      { char: 'ö', hint: 'Maj + ^ puis o' },
      { char: 'ù', hint: 'Touche ù (à côté de Entrée)' },
      { char: 'û', hint: '^ puis u' },
      { char: 'ü', hint: 'Maj + ^ puis u' },
      { char: 'ÿ', hint: 'Maj + ^ puis y' },
      { char: 'ç', hint: 'Touche 9' }
    ]
  },
  {
    title: 'Accents MAJUSCULES (souvent oubliés)',
    chars: [
      { char: 'À', hint: 'Maj + à (ou Verr. Maj + à)' },
      { char: 'É', hint: 'Maj + é (ou Verr. Maj + é)' },
      { char: 'È', hint: 'Maj + è' },
      { char: 'Ê', hint: '^ puis Maj + E' },
      { char: 'Ç', hint: 'Maj + ç' },
      { char: 'Ô', hint: '^ puis Maj + O' },
      { char: 'Î', hint: '^ puis Maj + I' },
      { char: 'Û', hint: '^ puis Maj + U' }
    ]
  },
  {
    title: 'Ponctuation française',
    chars: [
      { char: '«', hint: 'Guillemet français ouvrant' },
      { char: '»', hint: 'Guillemet français fermant' },
      { char: '–', hint: 'Tiret moyen (incises)' },
      { char: '—', hint: 'Tiret long (dialogue)' },
      { char: '…', hint: 'Points de suspension' },
      { char: '·', hint: 'Point médian' },
      { char: '“', hint: 'Guillemet anglais ouvrant' },
      { char: '”', hint: 'Guillemet anglais fermant' }
    ]
  },
  {
    title: 'Monnaies',
    chars: [
      { char: '€', hint: 'Euro — Alt Gr + E' },
      { char: '$', hint: 'Dollar — Touche $' },
      { char: '£', hint: 'Livre — Maj + $' },
      { char: '¥', hint: 'Yen' },
      { char: '¢', hint: 'Cent' }
    ]
  },
  {
    title: 'Programmation / informatique',
    chars: [
      { char: '{', hint: 'Alt Gr + 4 (\')' },
      { char: '}', hint: 'Alt Gr + = (+)' },
      { char: '[', hint: 'Alt Gr + 5 ((' },
      { char: ']', hint: 'Alt Gr + ° (])' },
      { char: '(', hint: 'Touche 5' },
      { char: ')', hint: 'Touche °' },
      { char: '|', hint: 'Alt Gr + 6 (-)' },
      { char: '\\', hint: 'Alt Gr + 8 (_)' },
      { char: '^', hint: 'Touche ^ (puis espace)' },
      { char: '~', hint: 'Alt Gr + 2 (é)' },
      { char: '`', hint: 'Alt Gr + 7 (è) puis espace' },
      { char: '<', hint: 'Touche <' },
      { char: '>', hint: 'Maj + <' }
    ]
  },
  {
    title: 'Symboles divers',
    chars: [
      { char: '°', hint: 'Touche ) (parenthèse fermante)' },
      { char: '±', hint: 'Plus ou moins' },
      { char: '×', hint: 'Multiplication' },
      { char: '÷', hint: 'Division' },
      { char: '≈', hint: 'Approximativement égal' },
      { char: '©', hint: 'Copyright' },
      { char: '®', hint: 'Marque déposée' },
      { char: '™', hint: 'Marque commerciale' },
      { char: '★', hint: 'Étoile pleine' },
      { char: '☆', hint: 'Étoile vide' },
      { char: '→', hint: 'Flèche droite' },
      { char: '←', hint: 'Flèche gauche' },
      { char: '↑', hint: 'Flèche haut' },
      { char: '↓', hint: 'Flèche bas' },
      { char: '✓', hint: 'Coche' },
      { char: '✗', hint: 'Croix' }
    ]
  }
];

// Référence au dernier champ de saisie actif
let lastActiveInput = null;
// Référence à l'indicateur de CapsLock affiché
let capsLockIndicator = null;
// Référence au panneau des caractères spéciaux
let specialCharsPanel = null;
// Référence à la bannière d'alerte de lien
let linkAlertBanner = null;

// Extensions de fichier considérées comme potentiellement dangereuses
const DANGEROUS_EXTENSIONS = {
  // Exécutables Windows
  exe: { risk: 'high', label: 'programme exécutable Windows' },
  msi: { risk: 'high', label: 'installateur Windows' },
  bat: { risk: 'high', label: 'script Windows' },
  cmd: { risk: 'high', label: 'script Windows' },
  com: { risk: 'high', label: 'programme Windows' },
  scr: { risk: 'high', label: 'économiseur d\'écran (souvent malveillant)' },
  pif: { risk: 'high', label: 'fichier programme caché' },
  vbs: { risk: 'high', label: 'script Visual Basic' },
  js: { risk: 'medium', label: 'script JavaScript' },
  jar: { risk: 'high', label: 'programme Java' },
  ps1: { risk: 'high', label: 'script PowerShell' },
  // Mobiles
  apk: { risk: 'high', label: 'application Android (hors store)' },
  ipa: { risk: 'high', label: 'application iOS (hors store)' },
  // macOS
  dmg: { risk: 'medium', label: 'image disque macOS' },
  pkg: { risk: 'medium', label: 'installateur macOS' },
  // Archives
  zip: { risk: 'medium', label: 'archive compressée — son contenu reste à vérifier' },
  rar: { risk: 'medium', label: 'archive compressée — son contenu reste à vérifier' },
  '7z': { risk: 'medium', label: 'archive compressée — son contenu reste à vérifier' },
  iso: { risk: 'medium', label: 'image disque' },
  // Documents à macros
  docm: { risk: 'high', label: 'document Word avec macros' },
  xlsm: { risk: 'high', label: 'tableur Excel avec macros' },
  pptm: { risk: 'high', label: 'présentation PowerPoint avec macros' }
};

// Référence à la bannière captcha (pour la fermer / éviter les doublons)
let captchaBanner = null;
// Référence à l'infobulle d'alerte de pièce jointe
let attachmentTooltip = null;

// Référence à l'indicateur de force affiché sur la page
let strengthWidget = null;

// Point d'entrée principal : charge les paramètres puis initialise les fonctionnalités
getSettings().then((settings) => {
  if (settings.highlightEnabled) initFieldHighlighter();
  if (settings.capsLockEnabled) initCapsLockDetector();
  if (settings.specialCharsEnabled) initSpecialCharsButton();
  if (settings.jargonEnabled) initJargonTranslator();
  if (settings.attachmentCheckerEnabled) initAttachmentChecker();
  if (settings.captchaDetectorEnabled) initCaptchaDetector();
  if (settings.autofillEnabled) initAutofillAndSavePrompt();
  initPasswordStrengthIndicator();
});

// Écoute les messages envoyés par le background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'showDangerZone') {
    showDangerZoneOverlay(message.domain);
  }
  if (message.action === 'showLinkAnalysis') {
    showLinkAnalysisBanner(message.isSuspicious, message.domain, message.message);
  }
  if (message.action === 'showTypoSuggestion') {
    showTypoSuggestionBanner(message.currentDomain, message.suggestion);
  }
});

/**
 * Affiche une bannière en haut de la page proposant un domaine officiel
 * proche de celui visité, en cas de faute de frappe potentielle.
 * @param {string} currentDomain
 * @param {string} suggestion
 */
function showTypoSuggestionBanner(currentDomain, suggestion) {
  // Évite les doublons
  if (document.getElementById('faciliweb-typo-banner')) return;

  const banner = createElement('div', {
    id: 'faciliweb-typo-banner',
    role: 'alert',
    'aria-live': 'assertive'
  });

  const icon = createElement('span', { className: 'faciliweb-typo-icon' }, '🔤');

  const text = createElement('div', { className: 'faciliweb-typo-text' });
  const title = createElement('strong', {}, 'Attention à l\'orthographe du site !');
  const detail = createElement('p', { className: 'faciliweb-typo-detail' });
  detail.textContent = '';
  detail.appendChild(document.createTextNode('Vous êtes sur '));
  const currentEl = createElement('code', { className: 'faciliweb-typo-current' }, currentDomain);
  detail.appendChild(currentEl);
  detail.appendChild(document.createTextNode('. Vouliez-vous dire '));
  const suggestEl = createElement('code', { className: 'faciliweb-typo-suggest' }, suggestion);
  detail.appendChild(suggestEl);
  detail.appendChild(document.createTextNode(' ?'));
  text.appendChild(title);
  text.appendChild(detail);

  // Bouton pour aller au site suggéré
  const goBtn = createElement('button', {
    className: 'faciliweb-typo-go'
  }, `Aller sur ${suggestion}`);
  goBtn.addEventListener('click', () => {
    window.location.href = `https://${suggestion}/`;
  });

  const closeBtn = createElement('button', {
    className: 'faciliweb-typo-close',
    'aria-label': 'Fermer'
  }, '✕');
  closeBtn.addEventListener('click', () => banner.remove());

  banner.appendChild(icon);
  banner.appendChild(text);
  banner.appendChild(goBtn);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}

// ─── FONCTIONNALITÉ 1 : SURLIGNAGE DES CHAMPS ─────────────────────────────

/**
 * Encadre les champs de texte en vert (champs normaux) ou en orange (champs sensibles).
 */
function initFieldHighlighter() {
  const inputs = document.querySelectorAll('input, textarea');

  inputs.forEach((input) => {
    highlightField(input);
  });

  // Surveille les nouveaux champs ajoutés dynamiquement (SPA, etc.)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const newInputs = node.querySelectorAll ? node.querySelectorAll('input, textarea') : [];
        newInputs.forEach(highlightField);
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
          highlightField(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Applique la bordure colorée sur un champ donné.
 * @param {HTMLElement} input - Le champ à surligner.
 */
function highlightField(input) {
  // Ignore les champs cachés et les cases à cocher
  if (['hidden', 'checkbox', 'radio', 'submit', 'button'].includes(input.type)) return;

  input.addEventListener('focus', () => {
    lastActiveInput = input;
    if (isSensitiveField(input)) {
      input.classList.add('faciliweb-field-sensitive');
      input.classList.remove('faciliweb-field-normal');
    } else {
      input.classList.add('faciliweb-field-normal');
      input.classList.remove('faciliweb-field-sensitive');
    }
  });

  input.addEventListener('blur', () => {
    input.classList.remove('faciliweb-field-normal', 'faciliweb-field-sensitive');
  });
}

// ─── FONCTIONNALITÉ 2 : DÉTECTION DU VERROUILLAGE DES MAJUSCULES ──────────

// Champ actuellement focalisé qui peut afficher le badge
let capsLockFocusedField = null;
// Dernier état connu de la touche CapsLock
let capsLockState = false;

/**
 * Crée un petit badge "🔠" collé au champ de saisie focalisé lorsque la touche
 * Verrouillage Majuscule est active. Au survol, une infobulle explique pourquoi.
 */
function initCapsLockDetector() {
  createCapsLockBadge();

  // Détecte l'état de CapsLock dès qu'une touche est enfoncée ou relâchée
  document.addEventListener('keydown', updateCapsState, true);
  document.addEventListener('keyup', updateCapsState, true);

  // Suit le champ focalisé pour positionner le badge correctement
  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) return;
    // Ignore les champs non textuels (checkbox, radio, etc.)
    const ignoredTypes = ['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'range', 'color', 'hidden'];
    if (target.tagName === 'INPUT' && ignoredTypes.includes(target.type)) return;

    capsLockFocusedField = target;
    refreshCapsLockBadge();
  }, true);

  document.addEventListener('focusout', () => {
    capsLockFocusedField = null;
    hideCapsLockBadge();
  }, true);

  // Repositionne le badge si la page défile ou est redimensionnée
  window.addEventListener('scroll', refreshCapsLockBadge, true);
  window.addEventListener('resize', refreshCapsLockBadge);
}

/**
 * Crée l'élément DOM du badge (masqué par défaut, ajouté une seule fois au body).
 */
function createCapsLockBadge() {
  capsLockIndicator = createElement('div', {
    id: 'faciliweb-capslock-badge',
    role: 'status',
    'aria-hidden': 'true',
    'aria-label': 'Verrouillage des majuscules activé',
    title: 'Verrouillage MAJUSCULES activé — vous tapez en majuscules. Appuyez sur Verr. Maj. pour le désactiver.'
  });

  // Icône composée : un cadenas plus la lettre "A" en grand
  const lock = createElement('span', { className: 'faciliweb-capslock-lock' }, '🔒');
  const letter = createElement('span', { className: 'faciliweb-capslock-letter' }, 'A');
  capsLockIndicator.appendChild(lock);
  capsLockIndicator.appendChild(letter);

  document.body.appendChild(capsLockIndicator);
}

/**
 * Lit l'état de la touche Verr. Maj. depuis un événement clavier et met à jour le badge.
 */
function updateCapsState(event) {
  if (!event.getModifierState) return;
  const newState = event.getModifierState('CapsLock');
  if (newState !== capsLockState) {
    capsLockState = newState;
    refreshCapsLockBadge();
  }
}

/**
 * Affiche ou masque le badge selon l'état combiné CapsLock + champ focalisé,
 * et le positionne près du bord droit du champ.
 */
function refreshCapsLockBadge() {
  if (!capsLockIndicator) return;

  if (!capsLockState || !capsLockFocusedField || !document.body.contains(capsLockFocusedField)) {
    hideCapsLockBadge();
    return;
  }

  const rect = capsLockFocusedField.getBoundingClientRect();

  // N'affiche pas si le champ est hors écran
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    hideCapsLockBadge();
    return;
  }

  capsLockIndicator.classList.add('faciliweb-capslock-visible');
  capsLockIndicator.setAttribute('aria-hidden', 'false');

  // Positionne le badge en haut à droite du champ, juste à l'extérieur
  const top = rect.top + window.scrollY + (rect.height / 2) - 14;
  const left = rect.right + window.scrollX + 6;
  capsLockIndicator.style.top = `${top}px`;
  capsLockIndicator.style.left = `${left}px`;
}

function hideCapsLockBadge() {
  if (!capsLockIndicator) return;
  capsLockIndicator.classList.remove('faciliweb-capslock-visible');
  capsLockIndicator.setAttribute('aria-hidden', 'true');
}

// ─── FONCTIONNALITÉ 3 : CARACTÈRES SPÉCIAUX ───────────────────────────────

/**
 * Crée le bouton flottant et le panneau des caractères spéciaux.
 */
function initSpecialCharsButton() {
  const trigger = createElement('button', {
    id: 'faciliweb-special-trigger',
    'aria-label': chrome.i18n.getMessage('specialCharsTitle'),
    title: chrome.i18n.getMessage('specialCharsTitle')
  }, '@€#');

  specialCharsPanel = createElement('div', {
    id: 'faciliweb-special-panel',
    role: 'dialog',
    'aria-label': chrome.i18n.getMessage('specialCharsTitle'),
    'aria-hidden': 'true'
  });

  const panelTitle = createElement('p', { className: 'faciliweb-panel-title' }, chrome.i18n.getMessage('specialCharsTitle'));
  const panelHint = createElement('p', { className: 'faciliweb-panel-hint' }, chrome.i18n.getMessage('specialCharsHint'));

  specialCharsPanel.appendChild(panelTitle);
  specialCharsPanel.appendChild(panelHint);

  // Crée une section par catégorie de caractères
  SPECIAL_CHARS_GROUPS.forEach((group) => {
    const groupTitle = createElement('h3', { className: 'faciliweb-char-group-title' }, group.title);
    specialCharsPanel.appendChild(groupTitle);

    const charGrid = createElement('div', { className: 'faciliweb-char-grid' });

    group.chars.forEach(({ char, hint }) => {
      const charBtn = createElement('button', {
        className: 'faciliweb-char-btn',
        title: `Pour faire ce signe au clavier : ${hint}`,
        'aria-label': `Insérer ${char} — raccourci clavier : ${hint}`,
        type: 'button'
      }, char);

      const charHint = createElement('span', { className: 'faciliweb-char-hint' }, hint);

      const charWrapper = createElement('div', { className: 'faciliweb-char-item' });
      charWrapper.appendChild(charBtn);
      charWrapper.appendChild(charHint);

      charBtn.addEventListener('click', () => insertCharacter(char));

      charGrid.appendChild(charWrapper);
    });

    specialCharsPanel.appendChild(charGrid);
  });

  trigger.addEventListener('click', toggleSpecialCharsPanel);

  document.body.appendChild(trigger);
  document.body.appendChild(specialCharsPanel);

  // Ferme le panneau si on clique à l'extérieur
  document.addEventListener('click', (e) => {
    if (!specialCharsPanel.contains(e.target) && e.target !== trigger) {
      closeSpecialCharsPanel();
    }
  });
}

/**
 * Insère un caractère dans le dernier champ de saisie actif.
 * @param {string} char - Le caractère à insérer.
 */
function insertCharacter(char) {
  if (!lastActiveInput) return;

  const start = lastActiveInput.selectionStart;
  const end = lastActiveInput.selectionEnd;
  const value = lastActiveInput.value;

  lastActiveInput.value = value.substring(0, start) + char + value.substring(end);
  lastActiveInput.selectionStart = start + char.length;
  lastActiveInput.selectionEnd = start + char.length;
  lastActiveInput.focus();

  // Déclenche l'événement input pour les frameworks JS (React, Vue, etc.)
  lastActiveInput.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Ouvre ou ferme le panneau des caractères spéciaux.
 */
function toggleSpecialCharsPanel() {
  const isHidden = specialCharsPanel.getAttribute('aria-hidden') === 'true';
  if (isHidden) {
    specialCharsPanel.setAttribute('aria-hidden', 'false');
    specialCharsPanel.classList.add('faciliweb-panel-visible');
  } else {
    closeSpecialCharsPanel();
  }
}

function closeSpecialCharsPanel() {
  if (!specialCharsPanel) return;
  specialCharsPanel.setAttribute('aria-hidden', 'true');
  specialCharsPanel.classList.remove('faciliweb-panel-visible');
}

// ─── FONCTIONNALITÉ 4 : TRADUCTEUR DE JARGON ──────────────────────────────

/**
 * Parcourt le texte de la page et ajoute des infobulles sur les termes techniques.
 */
function initJargonTranslator() {
  // Évite de traiter les iframes et pages sensibles
  if (window !== window.top) return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        // Ignore les scripts, styles, et éléments déjà traités
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toUpperCase();
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('[data-faciliweb-jargon]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => wrapJargonTerms(textNode));
}

/**
 * Remplace les occurrences de termes du dictionnaire par des éléments avec infobulle.
 * @param {Text} textNode - Le nœud texte à traiter.
 */
function wrapJargonTerms(textNode) {
  const originalText = textNode.textContent;
  const parent = textNode.parentElement;
  if (!parent) return;

  // Construit un regex avec tous les termes du dictionnaire
  const terms = Object.keys(JARGON_DICTIONARY);
  const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

  if (!pattern.test(originalText)) return;
  pattern.lastIndex = 0;

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(originalText)) !== null) {
    // Ajoute le texte avant le terme
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(originalText.slice(lastIndex, match.index)));
    }

    // Crée l'élément avec l'infobulle
    const termEl = createElement('span', {
      className: 'faciliweb-jargon-term',
      'data-faciliweb-jargon': 'true',
      role: 'tooltip',
      tabindex: '0',
      'aria-label': `Définition de ${match[0]} : ${JARGON_DICTIONARY[match[0].toLowerCase()]}`
    }, match[0]);

    const tooltip = createElement('span', {
      className: 'faciliweb-jargon-tooltip',
      role: 'definition'
    }, JARGON_DICTIONARY[match[0].toLowerCase()]);

    termEl.appendChild(tooltip);
    fragment.appendChild(termEl);
    lastIndex = pattern.lastIndex;
  }

  // Ajoute le texte restant après le dernier terme
  if (lastIndex < originalText.length) {
    fragment.appendChild(document.createTextNode(originalText.slice(lastIndex)));
  }

  parent.replaceChild(fragment, textNode);
}

// ─── FONCTIONNALITÉ 5 : ALERTE ZONE DE DANGER ─────────────────────────────

/**
 * Affiche un overlay plein écran si le site actuel est suspect.
 * @param {string} domain - Le domaine suspect détecté.
 */
function showDangerZoneOverlay(domain) {
  // Évite d'afficher l'overlay plusieurs fois
  if (document.getElementById('faciliweb-danger-overlay')) return;

  const overlay = createElement('div', {
    id: 'faciliweb-danger-overlay',
    role: 'alertdialog',
    'aria-modal': 'true',
    'aria-labelledby': 'faciliweb-danger-title',
    'aria-describedby': 'faciliweb-danger-message'
  });

  const box = createElement('div', { className: 'faciliweb-danger-box' });

  const icon = createElement('div', { className: 'faciliweb-danger-icon' }, '⚠️');

  const title = createElement('h1', {
    id: 'faciliweb-danger-title',
    className: 'faciliweb-danger-title'
  }, chrome.i18n.getMessage('dangerZoneTitle'));

  const msgText = chrome.i18n.getMessage('dangerZoneMessage');
  const msg = createElement('p', {
    id: 'faciliweb-danger-message',
    className: 'faciliweb-danger-message'
  }, msgText);

  // Affiche le domaine suspect de façon sécurisée (textContent, pas innerHTML)
  const domainEl = createElement('p', { className: 'faciliweb-danger-domain' }, domain);

  const backBtn = createElement('button', {
    className: 'faciliweb-btn faciliweb-btn-safe',
    autofocus: 'true'
  }, chrome.i18n.getMessage('dangerZoneBack'));

  const continueBtn = createElement('button', {
    className: 'faciliweb-btn faciliweb-btn-danger'
  }, chrome.i18n.getMessage('dangerZoneContinue'));

  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  continueBtn.addEventListener('click', () => {
    overlay.remove();
  });

  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(domainEl);
  box.appendChild(backBtn);
  box.appendChild(continueBtn);
  overlay.appendChild(box);

  document.body.appendChild(overlay);
}

// ─── FONCTIONNALITÉ 6 : BANNIÈRE D'ANALYSE DE LIEN ────────────────────────

/**
 * Affiche une bannière temporaire avec le résultat de l'analyse d'un lien.
 * @param {boolean} isSuspicious - Si true, le lien est suspect.
 * @param {string} domain - Le domaine analysé.
 * @param {string} message - Le message à afficher.
 */
function showLinkAnalysisBanner(isSuspicious, domain, message) {
  if (linkAlertBanner) linkAlertBanner.remove();

  linkAlertBanner = createElement('div', {
    id: 'faciliweb-link-banner',
    role: 'status',
    'aria-live': 'polite',
    className: isSuspicious ? 'faciliweb-banner-danger' : 'faciliweb-banner-safe'
  });

  const icon = isSuspicious ? '⚠️ ' : '✅ ';
  const textEl = createElement('span', {}, icon + message);
  const closeBtn = createElement('button', {
    className: 'faciliweb-banner-close',
    'aria-label': 'Fermer'
  }, '✕');

  closeBtn.addEventListener('click', () => linkAlertBanner.remove());

  linkAlertBanner.appendChild(textEl);
  linkAlertBanner.appendChild(closeBtn);
  document.body.appendChild(linkAlertBanner);

  // Ferme automatiquement après 8 secondes
  setTimeout(() => {
    if (linkAlertBanner) linkAlertBanner.remove();
  }, 8000);
}

// ─── FONCTIONNALITÉ 7 : VÉRIFICATEUR DE PIÈCE JOINTE ──────────────────────

/**
 * Analyse tous les liens de la page pour repérer ceux qui pointent vers
 * un fichier potentiellement dangereux. Affiche un avertissement au survol.
 */
function initAttachmentChecker() {
  attachmentTooltip = createElement('div', {
    id: 'faciliweb-attachment-tooltip',
    role: 'tooltip',
    'aria-hidden': 'true'
  });
  document.body.appendChild(attachmentTooltip);

  scanLinksForDangerousFiles(document);

  // Observe les liens ajoutés dynamiquement
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.tagName === 'A') {
          markLinkIfDangerous(node);
        } else if (node.querySelectorAll) {
          scanLinksForDangerousFiles(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Parcourt tous les liens d'un nœud racine et signale ceux qui sont dangereux.
 * @param {Element|Document} root
 */
function scanLinksForDangerousFiles(root) {
  const links = root.querySelectorAll('a[href]');
  links.forEach(markLinkIfDangerous);
}

/**
 * Si un lien pointe vers un fichier à risque, ajoute un badge visuel
 * et un gestionnaire d'événement qui affiche l'infobulle au survol/focus.
 * @param {HTMLAnchorElement} link
 */
function markLinkIfDangerous(link) {
  if (!link.href || link.dataset.faciliwebChecked) return;
  link.dataset.faciliwebChecked = '1';

  const extension = extractFileExtension(link.href);
  if (!extension) return;

  const info = DANGEROUS_EXTENSIONS[extension];
  if (!info) return;

  // Ajoute un badge visuel à côté du lien
  link.classList.add('faciliweb-dangerous-link');
  link.dataset.faciliwebRisk = info.risk;

  const badge = createElement('span', {
    className: `faciliweb-attachment-badge faciliweb-risk-${info.risk}`,
    'aria-label': `Pièce jointe à risque : ${info.label}`
  }, info.risk === 'high' ? '⚠️' : '❗');

  link.appendChild(badge);

  // Gestion du survol et du focus clavier
  const showTip = (e) => showAttachmentTooltip(link, extension, info, e);
  link.addEventListener('mouseenter', showTip);
  link.addEventListener('focus', showTip);
  link.addEventListener('mouseleave', hideAttachmentTooltip);
  link.addEventListener('blur', hideAttachmentTooltip);
}

/**
 * Extrait l'extension d'un fichier depuis une URL.
 * @param {string} url
 * @returns {string|null} L'extension en minuscules, sans le point.
 */
function extractFileExtension(url) {
  try {
    const pathname = new URL(url, document.baseURI).pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

/**
 * Affiche l'infobulle d'avertissement positionnée près du lien survolé.
 */
function showAttachmentTooltip(link, ext, info, event) {
  if (!attachmentTooltip) return;

  attachmentTooltip.textContent = '';

  const header = createElement('div', {
    className: 'faciliweb-tooltip-header'
  }, info.risk === 'high' ? '⚠️ Fichier potentiellement dangereux' : '❗ Fichier à vérifier');

  const body = createElement('p', {
    className: 'faciliweb-tooltip-body'
  }, `Ce lien télécharge un fichier .${ext} (${info.label}).`);

  const advice = createElement('p', {
    className: 'faciliweb-tooltip-advice'
  }, 'Téléchargez-le uniquement si vous attendiez ce fichier d\'une personne de confiance.');

  attachmentTooltip.appendChild(header);
  attachmentTooltip.appendChild(body);
  attachmentTooltip.appendChild(advice);
  attachmentTooltip.classList.add(`faciliweb-tooltip-${info.risk}`);
  attachmentTooltip.setAttribute('aria-hidden', 'false');

  // Positionne près du lien (en évitant de sortir de l'écran)
  const rect = link.getBoundingClientRect();
  const tipWidth = 280;
  let left = rect.left + window.scrollX;
  if (left + tipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tipWidth - 10;
  }
  attachmentTooltip.style.left = `${left}px`;
  attachmentTooltip.style.top = `${rect.bottom + window.scrollY + 6}px`;
}

function hideAttachmentTooltip() {
  if (!attachmentTooltip) return;
  attachmentTooltip.setAttribute('aria-hidden', 'true');
  attachmentTooltip.classList.remove('faciliweb-tooltip-high', 'faciliweb-tooltip-medium');
}

// ─── FONCTIONNALITÉ 8 : DÉTECTEUR DE CAPTCHA ──────────────────────────────

/**
 * Détecte la présence d'un captcha sur la page et rassure l'utilisateur
 * via une bannière pédagogique non bloquante.
 */
function initCaptchaDetector() {
  // Première vérification après chargement initial
  setTimeout(checkForCaptcha, 1500);

  // Surveille l'apparition d'un captcha injecté dynamiquement
  const observer = new MutationObserver(() => {
    if (!captchaBanner) checkForCaptcha();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Repère un captcha via des sélecteurs CSS courants. Si trouvé, affiche la bannière.
 */
function checkForCaptcha() {
  if (captchaBanner) return;

  const selectors = [
    '.g-recaptcha',
    '.h-captcha',
    '#cf-challenge-running',
    'iframe[src*="recaptcha"]',
    'iframe[src*="hcaptcha.com"]',
    'iframe[src*="challenges.cloudflare.com"]',
    'iframe[src*="arkoselabs.com"]',
    'iframe[title*="captcha" i]',
    'div[class*="captcha" i]'
  ];

  let detected = null;
  for (const selector of selectors) {
    try {
      const el = document.querySelector(selector);
      if (el) { detected = el; break; }
    } catch {
      // Ignore les sélecteurs invalides
    }
  }

  if (detected) showCaptchaBanner();
}

/**
 * Affiche une bannière rassurante en bas de la page expliquant ce qu'est un captcha.
 */
function showCaptchaBanner() {
  captchaBanner = createElement('div', {
    id: 'faciliweb-captcha-banner',
    role: 'status',
    'aria-live': 'polite'
  });

  const icon = createElement('span', { className: 'faciliweb-captcha-icon' }, '🤖');

  const text = createElement('div', { className: 'faciliweb-captcha-text' });
  const title = createElement('strong', {}, 'C\'est normal, ce n\'est pas une arnaque.');
  const desc = createElement('span', {},
    ' Le site vous demande de prouver que vous n\'êtes pas un robot. ' +
    'Suivez les instructions affichées (cocher une case ou cliquer sur des images).');
  text.appendChild(title);
  text.appendChild(desc);

  const closeBtn = createElement('button', {
    className: 'faciliweb-captcha-close',
    'aria-label': 'Fermer cette information'
  }, '✕');
  closeBtn.addEventListener('click', () => {
    if (captchaBanner) {
      captchaBanner.remove();
      captchaBanner = null;
    }
  });

  captchaBanner.appendChild(icon);
  captchaBanner.appendChild(text);
  captchaBanner.appendChild(closeBtn);
  document.body.appendChild(captchaBanner);
}

// ─── FONCTIONNALITÉ TRANSVERSALE : INDICATEUR DE FORCE DE MDP ─────────────

/**
 * Affiche un petit widget de force sous chaque champ `type="password"`
 * qui reçoit le focus sur n'importe quelle page web.
 * N'affecte pas les champs en mode "autocomplete" (lecture seule).
 */
function initPasswordStrengthIndicator() {
  createStrengthWidget();
  attachStrengthToExistingFields();

  const observer = new MutationObserver(() => attachStrengthToExistingFields());
  observer.observe(document.body, { childList: true, subtree: true });
}

function createStrengthWidget() {
  strengthWidget = createElement('div', {
    id: 'faciliweb-strength-widget',
    'aria-live': 'polite',
    'aria-hidden': 'true'
  });
  const bar = createElement('div', { className: 'faciliweb-strength-bar' });
  const fill = createElement('div', { id: 'faciliweb-strength-fill', className: 'faciliweb-strength-fill' });
  const label = createElement('span', { id: 'faciliweb-strength-label', className: 'faciliweb-strength-label' });
  bar.appendChild(fill);
  strengthWidget.appendChild(bar);
  strengthWidget.appendChild(label);
  document.body.appendChild(strengthWidget);
}

function attachStrengthToExistingFields() {
  document.querySelectorAll('input[type="password"]').forEach((field) => {
    if (field.dataset.faciliwebStrength) return;
    field.dataset.faciliwebStrength = '1';

    field.addEventListener('input', () => updateStrengthWidget(field));
    field.addEventListener('focus', () => {
      if (field.value) updateStrengthWidget(field);
      else positionStrengthWidget(field);
    });
    field.addEventListener('blur', () => hideStrengthWidget());
  });
}

function updateStrengthWidget(field) {
  if (!strengthWidget) return;

  // Calcul du score via une version simplifiée inline
  // (le script generator.js n'est pas chargé dans le contexte de page)
  const pwd = field.value;
  const score = evaluatePasswordStrength(pwd);
  const levels = [
    { label: 'Très faible', color: '#e74c3c' },
    { label: 'Faible',      color: '#e67e22' },
    { label: 'Moyen',       color: '#f0b429' },
    { label: 'Fort',        color: '#27ae60' },
    { label: 'Très fort',   color: '#1a7a4a' }
  ];
  const level = levels[Math.min(4, Math.max(0, score))];

  const fill  = document.getElementById('faciliweb-strength-fill');
  const label = document.getElementById('faciliweb-strength-label');
  if (fill && label) {
    fill.style.width      = ((score / 4) * 100) + '%';
    fill.style.background = level.color;
    label.textContent     = level.label;
    label.style.color     = level.color;
  }

  positionStrengthWidget(field);
  strengthWidget.setAttribute('aria-hidden', 'false');
}

function positionStrengthWidget(field) {
  if (!strengthWidget) return;
  const rect = field.getBoundingClientRect();
  strengthWidget.style.left  = `${rect.left + window.scrollX}px`;
  strengthWidget.style.top   = `${rect.bottom + window.scrollY + 4}px`;
  strengthWidget.style.width = `${rect.width}px`;
  strengthWidget.classList.add('faciliweb-strength-visible');
}

function hideStrengthWidget() {
  if (!strengthWidget) return;
  strengthWidget.classList.remove('faciliweb-strength-visible');
  strengthWidget.setAttribute('aria-hidden', 'true');
}

/**
 * Version allégée de l'évaluateur de force — utilisable dans content.js
 * sans dépendance au fichier generator.js (non chargé sur les pages web).
 */
function evaluatePasswordStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)  s++;
  if (pwd.length >= 12) s++;
  if (pwd.length >= 16) s++;
  const v = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(pwd)).length;
  if (v >= 3) s++;
  if (v === 4) s++;
  if (/^(.)\1+$/.test(pwd)) s = 0;
  return Math.min(4, Math.max(0, s));
}

// ─── FONCTIONNALITÉ 9 : AUTO-COMPLÉTION & PROPOSITION DE SAUVEGARDE ───────

const STORAGE_KEY_AUTOFILL = 'faciliweb_passwords';

// Référence à la suggestion d'auto-complétion affichée
let autofillSuggestion = null;
// Référence à la bannière de proposition de sauvegarde
let saveCredentialsPrompt = null;
// Dernière paire identifiant/mdp tapée — utilisée pour proposer la sauvegarde
let lastTypedCredentials = { username: '', password: '' };

/**
 * Active la détection des champs de connexion et la proposition de remplissage
 * automatique avec les identifiants enregistrés. Propose aussi de sauvegarder
 * de nouveaux identifiants lorsque l'utilisateur en saisit.
 */
function initAutofillAndSavePrompt() {
  attachAutofillToExistingFields();

  // Surveille les champs ajoutés dynamiquement (SPA, modales...)
  const observer = new MutationObserver(() => attachAutofillToExistingFields());
  observer.observe(document.body, { childList: true, subtree: true });

  // Intercepte les soumissions de formulaire pour proposer la sauvegarde
  document.addEventListener('submit', onFormSubmit, true);
}

/**
 * Attache les gestionnaires d'événements à tous les champs username/password
 * de la page qui n'en ont pas encore.
 */
function attachAutofillToExistingFields() {
  // Champs identifiants : email, text avec autocomplete/name "user", "login"
  const userFields = document.querySelectorAll(
    'input[type="email"], input[type="text"][autocomplete*="username"], input[type="text"][name*="user" i], input[type="text"][name*="login" i], input[type="text"][name*="email" i], input[type="text"][id*="email" i], input[type="text"][id*="login" i]'
  );
  userFields.forEach((field) => {
    if (field.dataset.faciliwebAutofill) return;
    field.dataset.faciliwebAutofill = '1';
    field.addEventListener('focus', () => suggestAutofillFor(field));
    field.addEventListener('input', () => {
      lastTypedCredentials.username = field.value;
      removeAutofillSuggestion();
    });
  });

  // Champs mots de passe : retient la valeur tapée
  const pwdFields = document.querySelectorAll('input[type="password"]');
  pwdFields.forEach((field) => {
    if (field.dataset.faciliwebAutofillPwd) return;
    field.dataset.faciliwebAutofillPwd = '1';
    field.addEventListener('input', () => { lastTypedCredentials.password = field.value; });
  });
}

/**
 * Affiche sous le champ une suggestion de remplissage automatique si des
 * identifiants existent pour le domaine courant.
 * @param {HTMLInputElement} field
 */
function suggestAutofillFor(field) {
  removeAutofillSuggestion();

  const currentHost = window.location.hostname.replace(/^www\./, '');
  if (!currentHost) return;

  chrome.storage.local.get({ [STORAGE_KEY_AUTOFILL]: [] }, (result) => {
    const matches = result[STORAGE_KEY_AUTOFILL].filter((entry) => {
      const entryHost = entry.site.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return entryHost === currentHost || currentHost.endsWith('.' + entryHost) || entryHost.endsWith('.' + currentHost);
    });
    if (matches.length === 0) return;

    // Crée la liste de suggestions
    autofillSuggestion = createElement('div', {
      id: 'faciliweb-autofill-suggestion',
      role: 'listbox',
      'aria-label': 'Identifiants enregistrés pour ce site'
    });

    const header = createElement('div', { className: 'faciliweb-autofill-header' },
      '🔑 FaciliWeb : utiliser un identifiant enregistré ?');
    autofillSuggestion.appendChild(header);

    matches.forEach((entry) => {
      const item = createElement('button', {
        className: 'faciliweb-autofill-item',
        type: 'button',
        role: 'option'
      });

      const icon = createElement('span', { className: 'faciliweb-autofill-icon' }, '👤');
      const text = createElement('span', { className: 'faciliweb-autofill-text' });
      const userEl = createElement('strong', {}, entry.username);
      const siteEl = createElement('span', { className: 'faciliweb-autofill-site' }, ' — ' + entry.site);
      text.appendChild(userEl); text.appendChild(siteEl);

      item.appendChild(icon); item.appendChild(text);
      item.addEventListener('click', (e) => {
        e.preventDefault();
        fillCredentials(field, entry);
        removeAutofillSuggestion();
      });
      autofillSuggestion.appendChild(item);
    });

    document.body.appendChild(autofillSuggestion);

    // Positionne sous le champ (en évitant les débordements)
    const rect = field.getBoundingClientRect();
    autofillSuggestion.style.left = `${rect.left + window.scrollX}px`;
    autofillSuggestion.style.top = `${rect.bottom + window.scrollY + 4}px`;
    autofillSuggestion.style.width = `${Math.max(rect.width, 260)}px`;
  });
}

function removeAutofillSuggestion() {
  if (autofillSuggestion) {
    autofillSuggestion.remove();
    autofillSuggestion = null;
  }
}

// Ferme la suggestion sur clic en dehors
document.addEventListener('click', (e) => {
  if (autofillSuggestion && !autofillSuggestion.contains(e.target)) {
    removeAutofillSuggestion();
  }
}, true);

/**
 * Remplit le champ identifiant et le champ mot de passe le plus proche
 * avec les valeurs enregistrées, en déclenchant les événements input/change
 * pour la compatibilité avec les frameworks JS.
 */
function fillCredentials(userField, entry) {
  setNativeValue(userField, entry.username);

  // Cherche le champ mot de passe le plus proche dans le même formulaire
  const form = userField.closest('form');
  let pwdField = null;
  if (form) {
    pwdField = form.querySelector('input[type="password"]');
  }
  if (!pwdField) {
    pwdField = document.querySelector('input[type="password"]');
  }
  if (pwdField) setNativeValue(pwdField, entry.password);
}

/**
 * Modifie la valeur d'un champ et déclenche les événements nécessaires
 * pour que les frameworks JS (React, Vue) détectent la modification.
 */
function setNativeValue(element, value) {
  const descriptor = Object.getOwnPropertyDescriptor(element, 'value') ||
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  if (descriptor && descriptor.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Intercepte les soumissions de formulaire contenant un mot de passe pour
 * proposer la sauvegarde des identifiants saisis (s'ils sont nouveaux).
 */
function onFormSubmit(event) {
  const form = event.target;
  if (!form || form.tagName !== 'FORM') return;

  const pwdField = form.querySelector('input[type="password"]');
  if (!pwdField || !pwdField.value) return;

  // Cherche le champ identifiant associé
  const userField = form.querySelector(
    'input[type="email"], input[type="text"][autocomplete*="username"], input[type="text"][name*="user" i], input[type="text"][name*="login" i], input[type="text"][name*="email" i]'
  );
  const username = userField ? userField.value : lastTypedCredentials.username;
  const password = pwdField.value;

  if (!username || !password) return;

  // Vérifie si ces identifiants existent déjà
  chrome.storage.local.get({ [STORAGE_KEY_AUTOFILL]: [] }, (result) => {
    const currentHost = window.location.hostname.replace(/^www\./, '');
    const exists = result[STORAGE_KEY_AUTOFILL].some((entry) => {
      const entryHost = entry.site.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return entryHost === currentHost && entry.username === username && entry.password === password;
    });
    if (!exists) showSaveCredentialsPrompt(currentHost, username, password);
  });
}

/**
 * Affiche une bannière en bas à droite proposant de sauvegarder les identifiants
 * qui viennent d'être saisis dans un formulaire.
 */
function showSaveCredentialsPrompt(site, username, password) {
  if (saveCredentialsPrompt) saveCredentialsPrompt.remove();

  saveCredentialsPrompt = createElement('div', {
    id: 'faciliweb-save-prompt',
    role: 'dialog',
    'aria-labelledby': 'faciliweb-save-title'
  });

  const title = createElement('div', {
    id: 'faciliweb-save-title',
    className: 'faciliweb-save-title'
  }, '🔑 Enregistrer ces identifiants ?');

  const detail = createElement('div', { className: 'faciliweb-save-detail' });
  const siteLine = createElement('div', {}, '🌐 ' + site);
  const userLine = createElement('div', {}, '👤 ' + username);
  detail.appendChild(siteLine); detail.appendChild(userLine);

  const actions = createElement('div', { className: 'faciliweb-save-actions' });

  const yesBtn = createElement('button', {
    className: 'faciliweb-save-yes',
    type: 'button'
  }, '💾 Enregistrer');

  const noBtn = createElement('button', {
    className: 'faciliweb-save-no',
    type: 'button'
  }, 'Pas maintenant');

  yesBtn.addEventListener('click', () => {
    chrome.storage.local.get({ [STORAGE_KEY_AUTOFILL]: [] }, (result) => {
      const entries = result[STORAGE_KEY_AUTOFILL];
      entries.push({ id: Date.now(), site, username, password });
      chrome.storage.local.set({ [STORAGE_KEY_AUTOFILL]: entries }, () => {
        saveCredentialsPrompt.remove();
        saveCredentialsPrompt = null;
      });
    });
  });

  noBtn.addEventListener('click', () => {
    saveCredentialsPrompt.remove();
    saveCredentialsPrompt = null;
  });

  actions.appendChild(yesBtn); actions.appendChild(noBtn);
  saveCredentialsPrompt.appendChild(title);
  saveCredentialsPrompt.appendChild(detail);
  saveCredentialsPrompt.appendChild(actions);
  document.body.appendChild(saveCredentialsPrompt);

  // Disparaît automatiquement après 15 secondes
  setTimeout(() => {
    if (saveCredentialsPrompt) {
      saveCredentialsPrompt.remove();
      saveCredentialsPrompt = null;
    }
  }, 15000);
}
