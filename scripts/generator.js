// Générateur de mot de passe sécurisé et évaluateur de force.
// Utilise crypto.getRandomValues — jamais Math.random().

'use strict';

const FW_GENERATOR = (() => {
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  const DIGITS    = '0123456789';
  const SYMBOLS   = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  /**
   * Génère un mot de passe aléatoire cryptographiquement sûr.
   * @param {object} opts
   * @param {number}  opts.length      Longueur souhaitée (12–64)
   * @param {boolean} opts.uppercase   Inclure les majuscules
   * @param {boolean} opts.lowercase   Inclure les minuscules
   * @param {boolean} opts.digits      Inclure les chiffres
   * @param {boolean} opts.symbols     Inclure les symboles
   * @returns {string}
   */
  function generate({ length = 16, uppercase = true, lowercase = true, digits = true, symbols = true } = {}) {
    let pool = '';
    const mandatory = [];

    if (uppercase) { pool += UPPERCASE; mandatory.push(pickRandom(UPPERCASE)); }
    if (lowercase) { pool += LOWERCASE; mandatory.push(pickRandom(LOWERCASE)); }
    if (digits)    { pool += DIGITS;    mandatory.push(pickRandom(DIGITS)); }
    if (symbols)   { pool += SYMBOLS;   mandatory.push(pickRandom(SYMBOLS)); }

    if (!pool) pool = LOWERCASE + DIGITS; // fallback minimal

    const clampedLength = Math.max(mandatory.length, Math.min(64, length));
    const remaining = clampedLength - mandatory.length;

    const chars = [...mandatory];
    for (let i = 0; i < remaining; i++) chars.push(pickRandom(pool));

    // Mélange cryptographique (Fisher-Yates via getRandomValues)
    for (let i = chars.length - 1; i > 0; i--) {
      const j = cryptoRandInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
  }

  /**
   * Évalue la force d'un mot de passe.
   * @param {string} password
   * @returns {{ score: number, label: string, color: string }}
   *          score 0–4 : 0=très faible, 1=faible, 2=moyen, 3=fort, 4=très fort
   */
  function evaluate(password) {
    if (!password) return { score: 0, label: 'Entrez un mot de passe', color: '#ccc' };

    let score = 0;
    const len = password.length;

    // Longueur
    if (len >= 8)  score++;
    if (len >= 12) score++;
    if (len >= 16) score++;

    // Variété des caractères
    const hasUpper   = /[A-Z]/.test(password);
    const hasLower   = /[a-z]/.test(password);
    const hasDigit   = /[0-9]/.test(password);
    const hasSymbol  = /[^A-Za-z0-9]/.test(password);
    const variety    = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
    if (variety >= 3) score++;
    if (variety === 4) score++;

    // Pénalités
    if (/^(.)\1+$/.test(password)) score = 0;          // tout un même caractère
    if (/^(123|abc|password|azerty|qwerty)/i.test(password)) score = Math.max(0, score - 2);

    const clamped = Math.min(4, Math.max(0, score));

    const levels = [
      { label: 'Très faible', color: '#e74c3c' },
      { label: 'Faible',      color: '#e67e22' },
      { label: 'Moyen',       color: '#f0b429' },
      { label: 'Fort',        color: '#27ae60' },
      { label: 'Très fort',   color: '#1a7a4a' }
    ];
    return { score: clamped, ...levels[clamped] };
  }

  // ─── Helpers internes ───────────────────────────────────────────────────

  function pickRandom(str) {
    return str[cryptoRandInt(str.length)];
  }

  function cryptoRandInt(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  return { generate, evaluate };
})();
