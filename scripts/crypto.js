// Utilitaires de chiffrement AES-GCM pour le gestionnaire d'identifiants.
// Utilise exclusivement l'API WebCrypto native du navigateur (aucune dépendance).

'use strict';

const FW_CRYPTO = (() => {
  const PBKDF2_ITERATIONS = 200_000;
  const SALT_BYTES        = 16;
  const IV_BYTES          = 12;
  // Valeur chiffrée pour vérifier que le mot de passe maître est correct
  const SENTINEL_PLAIN    = 'FACILIWEB_VAULT_OK_v1';

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // ─── Helpers Base64 ──────────────────────────────────────────────────────

  function toB64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }

  function fromB64(str) {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  }

  // ─── Dérivation de clé ───────────────────────────────────────────────────

  /**
   * Dérive une clé AES-256-GCM à partir du mot de passe maître et d'un sel.
   */
  async function deriveKey(masterPassword, salt) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // ─── Chiffrement / Déchiffrement ─────────────────────────────────────────

  /**
   * Chiffre une chaîne de texte et retourne un objet sérialisable.
   * @param {string} plaintext
   * @param {CryptoKey} key
   * @returns {Promise<{iv: string, data: string}>}
   */
  async function encrypt(plaintext, key) {
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plaintext)
    );
    return { iv: toB64(iv), data: toB64(ciphertext) };
  }

  /**
   * Déchiffre un objet produit par `encrypt`.
   * Lance une erreur si le mot de passe est incorrect.
   */
  async function decrypt(encrypted, key) {
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(encrypted.iv) },
      key,
      fromB64(encrypted.data)
    );
    return dec.decode(plainBuf);
  }

  // ─── Initialisation du coffre ─────────────────────────────────────────────

  /**
   * Crée un nouveau coffre vide protégé par `masterPassword`.
   * Retourne l'objet à stocker dans chrome.storage.local.
   */
  async function createVault(masterPassword) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const key  = await deriveKey(masterPassword, salt);
    // Sentinel : prouve que la clé est correcte lors du prochain déverrouillage
    const sentinel  = await encrypt(SENTINEL_PLAIN, key);
    const emptyData = await encrypt(JSON.stringify([]), key);
    return {
      salt:     toB64(salt),
      sentinel,
      entries:  emptyData
    };
  }

  /**
   * Tente de déverrouiller le coffre. Retourne `{ key, entries[] }` ou null.
   */
  async function unlockVault(vault, masterPassword) {
    try {
      const salt = fromB64(vault.salt);
      const key  = await deriveKey(masterPassword, salt);
      // Vérifie la clé via le sentinel avant de tout déchiffrer
      const check = await decrypt(vault.sentinel, key);
      if (check !== SENTINEL_PLAIN) return null;
      const json = await decrypt(vault.entries, key);
      return { key, entries: JSON.parse(json) };
    } catch {
      return null; // Mauvais mot de passe ou données corrompues
    }
  }

  /**
   * Rechiffre la liste d'identifiants et met à jour le coffre.
   */
  async function saveEntries(vault, entries, key) {
    vault.entries = await encrypt(JSON.stringify(entries), key);
    return vault;
  }

  return { createVault, unlockVault, saveEntries };
})();
