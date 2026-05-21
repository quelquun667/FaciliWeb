// Gestionnaire d'identifiants chiffré — FaciliWeb

'use strict';

const VAULT_KEY  = 'faciliweb_vault';        // Coffre chiffré (mode protégé)
const PLAIN_KEY  = 'faciliweb_passwords';    // Liste en clair (mode non protégé)
const SETTING_KEY = 'passwordProtectionEnabled';

// Clé AES en mémoire pour la session (effacée si la page se recharge)
let sessionKey = null;
let sessionEntries = [];
let isProtected = false;  // True si l'utilisateur utilise un mot de passe maître
let toastTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  // Gère les demandes de migration depuis les paramètres (?protect=enable|disable)
  const params = new URLSearchParams(window.location.search);
  const protectAction = params.get('protect');

  if (protectAction === 'enable')  { startProtectionEnable();  return; }
  if (protectAction === 'disable') { startProtectionDisable(); return; }

  // Démarrage normal — choisit l'interface selon la préférence utilisateur
  chrome.storage.local.get({ [SETTING_KEY]: false }, (s) => {
    isProtected = s[SETTING_KEY];
    if (isProtected) checkVaultStatus();
    else             enterUnprotectedMode();
  });
});

// ─── Mode non protégé (sans mot de passe maître) ──────────────────────────

/**
 * Charge directement les identifiants stockés en clair, sans demander de
 * mot de passe. Affiche un bandeau d'invitation à activer la protection.
 */
function enterUnprotectedMode() {
  chrome.storage.local.get({ [PLAIN_KEY]: [] }, (r) => {
    sessionEntries = r[PLAIN_KEY];
    document.getElementById('master-overlay').hidden = true;
    document.getElementById('vault-content').hidden  = false;

    // Bandeau informatif : la protection est désactivée
    showProtectionBanner();

    prefillCurrentSite();
    initForm();
    initSearch();
    initHeaderActions();
    renderList();
  });
}

/**
 * Ajoute un bandeau jaune en haut de la page rappelant que les identifiants
 * ne sont pas protégés par mot de passe. Cliquable pour activer la protection.
 */
function showProtectionBanner() {
  if (document.getElementById('fw-protection-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'fw-protection-banner';
  banner.className = 'protection-banner';
  banner.innerHTML = `
    <span class="protection-icon">⚠️</span>
    <span class="protection-text">
      Vos identifiants ne sont pas protégés par un mot de passe.
    </span>
    <button id="btn-enable-protection" class="btn btn-primary btn-small">🔐 Activer la protection</button>
  `;

  const main = document.querySelector('main.passwords-container');
  if (main) main.prepend(banner);

  document.getElementById('btn-enable-protection').addEventListener('click', () => {
    window.location.search = '?protect=enable';
  });
}

// ─── Activation de la protection (chiffrement des données existantes) ────

/**
 * Affiche un overlay demandant à l'utilisateur de créer un mot de passe
 * maître, puis chiffre tous ses identifiants existants dans le coffre.
 */
function startProtectionEnable() {
  const overlay = document.getElementById('master-overlay');
  const desc    = document.getElementById('master-desc');
  const confirm = document.getElementById('master-confirm-row');
  const submit  = document.getElementById('master-submit');
  const strengthBar = document.getElementById('master-strength-bar');
  const title   = document.getElementById('master-title');

  overlay.hidden = false;
  title.textContent = '🔐 Activer la protection';
  desc.textContent = 'Choisissez un mot de passe maître. ⚠️ Notez-le : sans lui, vos identifiants seront irrécupérables.';
  confirm.hidden = false;
  submit.textContent = '🔐 Activer la protection';
  strengthBar.hidden = false;

  document.getElementById('master-input').addEventListener('input', (e) => {
    const r = FW_GENERATOR.evaluate(e.target.value);
    updateStrengthUI('master-strength-fill', 'master-strength-label', r);
  });

  document.getElementById('master-toggle-eye').addEventListener('click', () => {
    const inp = document.getElementById('master-input');
    const isHidden = inp.type === 'password';
    inp.type = isHidden ? 'text' : 'password';
    document.getElementById('master-toggle-eye').textContent = isHidden ? '🙈' : '👁️';
  });

  const onSubmit = async () => {
    const pwd    = document.getElementById('master-input').value;
    const cpwd   = document.getElementById('master-confirm').value;
    const errEl  = document.getElementById('master-error');

    if (pwd.length < 8) { errEl.textContent = '⚠️ Mot de passe maître : minimum 8 caractères.'; return; }
    if (pwd !== cpwd)   { errEl.textContent = '⚠️ Les deux mots de passe ne correspondent pas.'; return; }

    errEl.textContent = '';
    submit.disabled = true;
    submit.textContent = '⏳ Chiffrement...';

    // Récupère les identifiants en clair existants
    const stored  = await chrome.storage.local.get({ [PLAIN_KEY]: [] });
    const entries = stored[PLAIN_KEY];

    // Crée le coffre, le déverrouille pour ranger les entrées
    const vault   = await FW_CRYPTO.createVault(pwd);
    const opened  = await FW_CRYPTO.unlockVault(vault, pwd);
    const updated = await FW_CRYPTO.saveEntries(vault, entries, opened.key);

    await chrome.storage.local.set({
      [VAULT_KEY]: updated,
      [SETTING_KEY]: true
    });
    // Supprime les données en clair une fois chiffrées
    await chrome.storage.local.remove(PLAIN_KEY);

    // Redirige vers la page sans paramètre — déverrouillage normal ensuite
    window.location.href = chrome.runtime.getURL('passwords/passwords.html');
  };

  submit.addEventListener('click', onSubmit);
  document.getElementById('master-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSubmit();
  });
  document.getElementById('master-input').focus();
}

// ─── Désactivation de la protection (déchiffrement vers clair) ────────────

/**
 * Demande le mot de passe maître pour confirmer la désactivation, puis
 * stocke les identifiants en clair et supprime le coffre chiffré.
 */
function startProtectionDisable() {
  const overlay = document.getElementById('master-overlay');
  const desc    = document.getElementById('master-desc');
  const confirm = document.getElementById('master-confirm-row');
  const submit  = document.getElementById('master-submit');
  const title   = document.getElementById('master-title');

  chrome.storage.local.get({ [VAULT_KEY]: null }, (result) => {
    if (!result[VAULT_KEY]) {
      // Pas de coffre existant : on désactive juste le réglage
      chrome.storage.local.set({ [SETTING_KEY]: false }, () => {
        window.location.href = chrome.runtime.getURL('passwords/passwords.html');
      });
      return;
    }

    const vault = result[VAULT_KEY];

    overlay.hidden = false;
    title.textContent = '🔓 Désactiver la protection';
    desc.textContent = 'Entrez votre mot de passe maître pour confirmer. Vos identifiants seront stockés sans chiffrement.';
    confirm.hidden = true;
    submit.textContent = '🔓 Désactiver la protection';

    document.getElementById('master-toggle-eye').addEventListener('click', () => {
      const inp = document.getElementById('master-input');
      const isHidden = inp.type === 'password';
      inp.type = isHidden ? 'text' : 'password';
      document.getElementById('master-toggle-eye').textContent = isHidden ? '🙈' : '👁️';
    });

    const onSubmit = async () => {
      const pwd   = document.getElementById('master-input').value;
      const errEl = document.getElementById('master-error');

      submit.disabled = true;
      submit.textContent = '⏳ Déchiffrement...';
      errEl.textContent = '⏳ Calcul de la clé en cours, cela peut prendre quelques secondes...';
      errEl.style.color = '#888';

      const r = await FW_CRYPTO.unlockVault(vault, pwd);
      if (!r) {
        errEl.textContent = '❌ Mot de passe maître incorrect.';
        errEl.style.color = '';
        submit.disabled = false;
        submit.textContent = '🔓 Désactiver la protection';
        document.getElementById('master-input').value = '';
        document.getElementById('master-input').focus();
        return;
      }

      // Stocke en clair, supprime le coffre, désactive le réglage
      await chrome.storage.local.set({
        [PLAIN_KEY]: r.entries,
        [SETTING_KEY]: false
      });
      await chrome.storage.local.remove(VAULT_KEY);

      window.location.href = chrome.runtime.getURL('passwords/passwords.html');
    };

    submit.addEventListener('click', onSubmit);
    document.getElementById('master-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onSubmit();
    });
    document.getElementById('master-input').focus();
  });
}

// ─── Coffre-fort : déverrouillage ─────────────────────────────────────────

/**
 * Vérifie si un coffre existe déjà dans le stockage.
 * Affiche l'overlay "créer" ou "déverrouiller" en conséquence.
 */
function checkVaultStatus() {
  chrome.storage.local.get({ [VAULT_KEY]: null }, (result) => {
    const overlay = document.getElementById('master-overlay');
    const desc    = document.getElementById('master-desc');
    const confirm = document.getElementById('master-confirm-row');
    const submit  = document.getElementById('master-submit');
    const strengthBar = document.getElementById('master-strength-bar');

    overlay.hidden = false;

    if (result[VAULT_KEY]) {
      // Coffre existant : mode déverrouillage
      desc.textContent = 'Entrez votre mot de passe maître pour accéder à vos identifiants.';
      submit.textContent = '🔓 Déverrouiller';
    } else {
      // Première fois : mode création
      desc.textContent = 'Choisissez un mot de passe maître pour protéger vos identifiants. ⚠️ Notez-le : sans lui les données sont irrécupérables.';
      confirm.hidden = false;
      submit.textContent = '🔐 Créer le coffre';
      strengthBar.hidden = false;

      // Indicateur de force en temps réel sur la création
      document.getElementById('master-input').addEventListener('input', (e) => {
        const result = FW_GENERATOR.evaluate(e.target.value);
        updateStrengthUI('master-strength-fill', 'master-strength-label', result);
      });
    }

    // Afficher/masquer le mot de passe maître
    document.getElementById('master-toggle-eye').addEventListener('click', () => {
      const inp = document.getElementById('master-input');
      const isHidden = inp.type === 'password';
      inp.type = isHidden ? 'text' : 'password';
      document.getElementById('master-toggle-eye').textContent = isHidden ? '🙈' : '👁️';
    });

    // Soumission
    document.getElementById('master-submit').addEventListener('click', () => {
      result[VAULT_KEY] ? unlockVault(result[VAULT_KEY]) : createVault();
    });

    document.getElementById('master-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') result[VAULT_KEY] ? unlockVault(result[VAULT_KEY]) : createVault();
    });

    document.getElementById('master-input').focus();
  });
}

async function createVault() {
  const pwd     = document.getElementById('master-input').value;
  const confirm = document.getElementById('master-confirm').value;
  const errEl   = document.getElementById('master-error');

  if (pwd.length < 8) { errEl.textContent = '⚠️ Le mot de passe maître doit faire au moins 8 caractères.'; return; }
  if (pwd !== confirm) { errEl.textContent = '⚠️ Les deux mots de passe ne correspondent pas.'; return; }

  errEl.textContent = '';
  document.getElementById('master-submit').disabled = true;
  document.getElementById('master-submit').textContent = '⏳ Création...';

  const vault = await FW_CRYPTO.createVault(pwd);
  await chrome.storage.local.set({ [VAULT_KEY]: vault });

  // Déverrouille immédiatement après création
  unlockVault(vault);
}

async function unlockVault(vault) {
  const pwd   = document.getElementById('master-input').value;
  const errEl = document.getElementById('master-error');

  document.getElementById('master-submit').disabled = true;
  document.getElementById('master-submit').textContent = '⏳ Déverrouillage...';
  errEl.textContent = '⏳ Calcul de la clé en cours, cela peut prendre quelques secondes...';
  errEl.style.color = '#888';

  const result = await FW_CRYPTO.unlockVault(vault, pwd);

  if (!result) {
    errEl.textContent = '❌ Mot de passe maître incorrect.';
    errEl.style.color = '';
    document.getElementById('master-submit').disabled = false;
    document.getElementById('master-submit').textContent = '🔓 Déverrouiller';
    document.getElementById('master-input').value = '';
    document.getElementById('master-input').focus();
    return;
  }

  errEl.textContent = '';
  errEl.style.color = '';
  sessionKey     = result.key;
  sessionEntries = result.entries;
  isProtected    = true;

  document.getElementById('master-overlay').hidden = true;
  document.getElementById('vault-content').hidden   = false;

  prefillCurrentSite();
  initForm();
  initSearch();
  initHeaderActions();
  renderList();
}

// ─── Verrouillage de session ──────────────────────────────────────────────

function lockVault() {
  sessionKey     = null;
  sessionEntries = [];
  document.getElementById('vault-content').hidden = true;
  // Recharge la page pour revenir à l'overlay proprement
  location.reload();
}

// ─── Pré-remplissage du site ──────────────────────────────────────────────

function prefillCurrentSite() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('from');
  if (fromUrl) {
    try {
      const domain = new URL(fromUrl).hostname.replace(/^www\./, '');
      const input = document.getElementById('input-site');
      if (input && !input.value) input.value = domain;
      return;
    } catch { /* URL invalide */ }
  }
  chrome.tabs.query({}, (allTabs) => {
    const ext = chrome.runtime.getURL('');
    const candidate = allTabs
      .filter((t) => t.url && t.url.startsWith('http') && !t.url.startsWith(ext))
      .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))[0];
    if (!candidate) return;
    try {
      const domain = new URL(candidate.url).hostname.replace(/^www\./, '');
      const input = document.getElementById('input-site');
      if (input && !input.value) input.value = domain;
    } catch { /* URL invalide */ }
  });
}

// ─── Formulaire (ajout & modification) ───────────────────────────────────

function initForm() {
  const toggleBtn = document.getElementById('btn-toggle-form');
  const form      = document.getElementById('password-form');
  const cancelBtn = document.getElementById('btn-cancel');
  const pwdInput  = document.getElementById('input-password');
  const eyeBtn    = document.getElementById('btn-toggle-pwd');
  const genBtn    = document.getElementById('btn-generate');
  const genOpts   = document.getElementById('gen-options');
  const regenBtn  = document.getElementById('btn-regenerate');

  toggleBtn.addEventListener('click', () => {
    const hidden = form.classList.toggle('hidden');
    toggleBtn.setAttribute('aria-expanded', String(!hidden));
    if (!hidden) {
      document.getElementById('edit-id').value = '';
      document.getElementById('form-section-title').textContent = '➕ Ajouter un identifiant';
      document.getElementById('btn-form-submit').textContent = '💾 Enregistrer';
      prefillCurrentSite();
      document.getElementById('input-site').focus();
    }
  });

  cancelBtn.addEventListener('click', resetForm);

  eyeBtn.addEventListener('click', () => {
    const isHidden = pwdInput.type === 'password';
    pwdInput.type = isHidden ? 'text' : 'password';
    eyeBtn.textContent = isHidden ? '🙈' : '👁️';
  });

  // Indicateur de force en temps réel
  pwdInput.addEventListener('input', () => {
    const result = FW_GENERATOR.evaluate(pwdInput.value);
    updateStrengthUI('form-strength-fill', 'form-strength-label', result);
  });

  // Générateur
  genBtn.addEventListener('click', () => {
    genOpts.classList.toggle('hidden');
    if (!genOpts.classList.contains('hidden')) generatePassword();
  });

  regenBtn.addEventListener('click', generatePassword);

  form.addEventListener('submit', (e) => { e.preventDefault(); saveEntry(); });
}

function generatePassword() {
  const pwd = FW_GENERATOR.generate({
    length:    Number(document.getElementById('gen-length').value) || 16,
    uppercase: document.getElementById('gen-upper').checked,
    lowercase: document.getElementById('gen-lower').checked,
    digits:    document.getElementById('gen-digits').checked,
    symbols:   document.getElementById('gen-symbols').checked
  });
  const pwdInput = document.getElementById('input-password');
  pwdInput.type  = 'text';
  pwdInput.value = pwd;
  document.getElementById('btn-toggle-pwd').textContent = '🙈';
  const result = FW_GENERATOR.evaluate(pwd);
  updateStrengthUI('form-strength-fill', 'form-strength-label', result);
}

function resetForm() {
  const form = document.getElementById('password-form');
  form.reset();
  form.classList.add('hidden');
  document.getElementById('btn-toggle-form').setAttribute('aria-expanded', 'false');
  document.getElementById('edit-id').value = '';
  document.getElementById('gen-options').classList.add('hidden');
  updateStrengthUI('form-strength-fill', 'form-strength-label', FW_GENERATOR.evaluate(''));
  prefillCurrentSite();
}

async function saveEntry() {
  const id       = document.getElementById('edit-id').value;
  const site     = document.getElementById('input-site').value.trim();
  const username = document.getElementById('input-username').value.trim();
  const password = document.getElementById('input-password').value;

  if (!site || !username || !password) {
    showToast('⚠️ Tous les champs sont obligatoires');
    return;
  }

  if (id) {
    // Modification d'une entrée existante
    const idx = sessionEntries.findIndex((e) => String(e.id) === id);
    if (idx !== -1) sessionEntries[idx] = { ...sessionEntries[idx], site, username, password };
  } else {
    sessionEntries.push({ id: Date.now(), site, username, password });
  }

  await persistVault();
  showToast(id ? '✅ Identifiant modifié' : '✅ Identifiant enregistré');
  resetForm();
  renderList();
}

// ─── Entrée existante : édition ───────────────────────────────────────────

function openEditMode(entry) {
  const form = document.getElementById('password-form');
  document.getElementById('edit-id').value       = String(entry.id);
  document.getElementById('input-site').value    = entry.site;
  document.getElementById('input-username').value = entry.username;
  document.getElementById('input-password').value = entry.password;
  document.getElementById('password-form').querySelector('input[type="password"]').type = 'text';
  document.getElementById('btn-toggle-pwd').textContent = '🙈';
  document.getElementById('form-section-title').textContent = '✏️ Modifier l\'identifiant';
  document.getElementById('btn-form-submit').textContent = '💾 Enregistrer les modifications';
  const strength = FW_GENERATOR.evaluate(entry.password);
  updateStrengthUI('form-strength-fill', 'form-strength-label', strength);
  form.classList.remove('hidden');
  document.getElementById('btn-toggle-form').setAttribute('aria-expanded', 'true');
  document.getElementById('input-site').focus();
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Rendu de la liste ────────────────────────────────────────────────────

function renderList() {
  const container = document.getElementById('password-list');
  container.textContent = '';
  const query = (document.getElementById('search-input').value || '').toLowerCase();

  const filtered = sessionEntries.filter((e) =>
    !query || (e.site + ' ' + e.username).toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    const p = document.createElement('p');
    p.className = 'password-empty';
    p.textContent = sessionEntries.length === 0
      ? 'Aucun identifiant enregistré pour le moment.'
      : 'Aucun résultat pour cette recherche.';
    container.appendChild(p);
    return;
  }

  filtered.forEach((entry) => container.appendChild(createEntry(entry)));
}

function createEntry(entry) {
  const wrap = document.createElement('div');
  wrap.className = 'password-entry';

  const info = document.createElement('div');
  info.className = 'password-entry-info';

  const siteEl = document.createElement('span');
  siteEl.className = 'password-entry-site';
  siteEl.textContent = entry.site;

  const userEl = document.createElement('span');
  userEl.className = 'password-entry-user';
  userEl.textContent = '👤 ' + entry.username;

  const pwdEl = document.createElement('span');
  pwdEl.className = 'password-entry-password';
  pwdEl.textContent = '🔒 ' + '•'.repeat(Math.min(entry.password.length, 14));

  // Indicateur de force inline
  const str = FW_GENERATOR.evaluate(entry.password);
  const strBadge = document.createElement('span');
  strBadge.className = 'entry-strength-badge';
  strBadge.style.color = str.color;
  strBadge.textContent = str.label;

  info.append(siteEl, userEl, pwdEl, strBadge);

  const actions = document.createElement('div');
  actions.className = 'password-entry-actions';

  const eyeBtn  = makeActionBtn('👁️', `Voir le mot de passe de ${entry.site}`, () => {
    const hidden = pwdEl.textContent.includes('•');
    pwdEl.textContent = hidden ? '🔓 ' + entry.password : '🔒 ' + '•'.repeat(Math.min(entry.password.length, 14));
    eyeBtn.textContent = hidden ? '🙈' : '👁️';
  });

  const copyBtn = makeActionBtn('📋', `Copier le mot de passe de ${entry.site}`, () => {
    navigator.clipboard.writeText(entry.password).then(() => showToast('📋 Mot de passe copié'));
  });

  const editBtn = makeActionBtn('✏️', `Modifier ${entry.site}`, () => openEditMode(entry));

  const delBtn  = makeActionBtn('🗑️', `Supprimer ${entry.site}`, async () => {
    if (!confirm(`Supprimer l'identifiant pour ${entry.site} ?`)) return;
    sessionEntries = sessionEntries.filter((e) => e.id !== entry.id);
    await persistVault();
    showToast('🗑️ Identifiant supprimé');
    renderList();
  }, true);

  actions.append(eyeBtn, copyBtn, editBtn, delBtn);
  wrap.append(info, actions);
  return wrap;
}

function makeActionBtn(icon, label, handler, danger = false) {
  const btn = document.createElement('button');
  btn.className  = 'action-btn' + (danger ? ' action-danger' : '');
  btn.textContent = icon;
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', handler);
  return btn;
}

// ─── Recherche ────────────────────────────────────────────────────────────

function initSearch() {
  document.getElementById('search-input').addEventListener('input', renderList);
}

// ─── Persistance (mode chiffré ou clair selon la préférence) ──────────────

async function persistVault() {
  if (isProtected) {
    // Mode chiffré : rechiffre le tableau et écrit dans le coffre
    const vault = await chrome.storage.local.get({ [VAULT_KEY]: null });
    const updated = await FW_CRYPTO.saveEntries(vault[VAULT_KEY], sessionEntries, sessionKey);
    await chrome.storage.local.set({ [VAULT_KEY]: updated });
  } else {
    // Mode clair : écrit directement le tableau
    await chrome.storage.local.set({ [PLAIN_KEY]: sessionEntries });
  }
}

// ─── Import / Export ──────────────────────────────────────────────────────

function initHeaderActions() {
  const lockBtn = document.getElementById('btn-lock');
  // Bouton verrouiller : visible uniquement en mode protégé
  if (isProtected) {
    lockBtn.addEventListener('click', lockVault);
  } else {
    lockBtn.hidden = true;
  }
  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('import-file').addEventListener('change', importData);
}

function exportData() {
  const data = JSON.stringify(sessionEntries, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `faciliweb-identifiants-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 Export téléchargé');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('Format invalide');

      const validEntries = imported.filter((x) => x.site && x.username && x.password);
      if (validEntries.length === 0) throw new Error('Aucune entrée valide trouvée');

      const action = confirm(
        `${validEntries.length} identifiant(s) trouvé(s).\n\n` +
        `Cliquez OK pour les AJOUTER aux identifiants existants.\n` +
        `Cliquez Annuler pour REMPLACER tous vos identifiants actuels.`
      );

      if (action) {
        // Fusion : écrase si même site+username
        validEntries.forEach((imp) => {
          const existing = sessionEntries.findIndex(
            (e) => e.site === imp.site && e.username === imp.username
          );
          if (existing !== -1) {
            sessionEntries[existing] = { ...sessionEntries[existing], password: imp.password };
          } else {
            sessionEntries.push({ ...imp, id: Date.now() + Math.random() });
          }
        });
      } else {
        sessionEntries = validEntries.map((x) => ({ ...x, id: Date.now() + Math.random() }));
      }

      await persistVault();
      renderList();
      showToast(`✅ ${validEntries.length} identifiant(s) importé(s)`);
    } catch (err) {
      showToast(`❌ Erreur d'import : ${err.message}`);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ─── Indicateur de force (UI) ─────────────────────────────────────────────

function updateStrengthUI(fillId, labelId, result) {
  const fill  = document.getElementById(fillId);
  const label = document.getElementById(labelId);
  if (!fill || !label) return;
  const pct = result.score === 0 ? 0 : (result.score / 4) * 100;
  fill.style.width      = pct + '%';
  fill.style.background = result.color;
  label.textContent     = result.label;
  label.style.color     = result.color;
}

// ─── Toast ────────────────────────────────────────────────────────────────

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
}
