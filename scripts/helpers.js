// Fonctions utilitaires partagées entre les scripts de contenu

'use strict';

/**
 * Récupère les paramètres depuis le stockage local de Chrome.
 * Retourne une promesse résolue avec les paramètres ou les valeurs par défaut.
 */
function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      {
        // Valeurs par défaut pour tous les paramètres
        capsLockEnabled: true,
        // Le surlignage des champs est désactivé par défaut car il peut
        // entrer en conflit visuel avec le style natif de certains sites.
        highlightEnabled: false,
        specialCharsEnabled: true,
        phishingEnabled: true,
        jargonEnabled: true,
        attachmentCheckerEnabled: true,
        captchaDetectorEnabled: true,
        typoDetectorEnabled: true,
        autofillEnabled: true,
        language: 'fr'
      },
      (items) => resolve(items)
    );
  });
}

/**
 * Détermine si un élément est un champ sensible (email, téléphone, mot de passe).
 * @param {HTMLElement} element - L'élément à vérifier.
 * @returns {boolean}
 */
function isSensitiveField(element) {
  const sensitiveTypes = ['email', 'tel', 'password'];
  const sensitivePatterns = ['mail', 'email', 'phone', 'tel', 'password', 'mdp', 'pwd'];

  if (sensitiveTypes.includes(element.type)) return true;

  const nameOrId = (element.name + ' ' + element.id + ' ' + element.placeholder).toLowerCase();
  return sensitivePatterns.some((pattern) => nameOrId.includes(pattern));
}

/**
 * Crée un élément DOM avec les attributs et le contenu fournis.
 * Méthode sécurisée : n'utilise jamais innerHTML avec des données externes.
 * @param {string} tag - La balise HTML.
 * @param {Object} attrs - Les attributs à appliquer.
 * @param {string} [textContent] - Le contenu texte (pas de HTML brut).
 * @returns {HTMLElement}
 */
function createElement(tag, attrs = {}, textContent = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else {
      el.setAttribute(key, value);
    }
  });
  if (textContent) el.textContent = textContent;
  return el;
}

/**
 * Extrait le domaine principal (eTLD+1) d'une URL.
 * @param {string} url - L'URL à analyser.
 * @returns {string|null} Le domaine ou null si invalide.
 */
function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Vérifie si un domaine est dans une liste noire connue.
 * @param {string} domain - Le domaine à vérifier.
 * @param {string[]} blacklist - La liste des domaines suspects.
 * @returns {boolean}
 */
function isDomainBlacklisted(domain, blacklist) {
  if (!domain) return false;
  return blacklist.some((blocked) => domain === blocked || domain.endsWith('.' + blocked));
}

/**
 * Échappe les caractères spéciaux pour l'affichage dans un texte (pas de HTML injection).
 * @param {string} text - Le texte à échapper.
 * @returns {string}
 */
function escapeText(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
