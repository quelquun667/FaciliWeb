// Page de sauvegarde avant mise à jour — FaciliWeb

'use strict';

const VAULT_KEY     = 'faciliweb_vault';
const SETTINGS_KEYS = [
  'capsLockEnabled', 'highlightEnabled', 'specialCharsEnabled', 'jargonEnabled',
  'phishingEnabled', 'typoDetectorEnabled', 'attachmentCheckerEnabled',
  'captchaDetectorEnabled', 'autofillEnabled', 'weeklySummaryEnabled',
  'darkMode', 'theme', 'language', 'breakTimerEnabled', 'breakTimerMinutes',
  'faciliweb_notes'
];

document.addEventListener('DOMContentLoaded', () => {
  initReleaseLink();
  initTogglePwd();
  initExportSettings();
  initExportCredentials();
});

// ─── Lien de release ──────────────────────────────────────────────────────

function initReleaseLink() {
  const params  = new URLSearchParams(window.location.search);
  const release = params.get('release');
  const version = params.get('version');
  const link    = document.getElementById('btn-go-release');
  const subtitle = document.getElementById('export-subtitle');

  if (version && subtitle) {
    subtitle.textContent = `Version v${version} disponible. Exportez vos données puis installez la mise à jour.`;
  }

  if (release && link) {
    link.href = release;
  } else {
    link.href = 'https://github.com/quelquun667/FaciliWeb/releases/latest';
  }
}

// ─── Afficher/masquer le mot de passe maître ─────────────────────────────

function initTogglePwd() {
  const input = document.getElementById('export-master-pwd');
  const btn   = document.getElementById('btn-toggle-export-pwd');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const hidden = input.type === 'password';
    input.type   = hidden ? 'text' : 'password';
    btn.textContent = hidden ? '🙈' : '👁️';
  });
}

// ─── Export des paramètres ────────────────────────────────────────────────

function initExportSettings() {
  document.getElementById('btn-export-settings').addEventListener('click', exportSettings);
}

function exportSettings() {
  const status = document.getElementById('settings-export-status');
  status.textContent = '⏳ Préparation...';
  status.style.color = '';

  chrome.storage.local.get(SETTINGS_KEYS, (result) => {
    const exportData = {
      _meta: {
        exportedAt: new Date().toISOString(),
        extensionVersion: chrome.runtime.getManifest().version,
        type: 'faciliweb-settings'
      },
      settings: result
    };

    downloadJSON(exportData, `faciliweb-settings-${dateStamp()}.json`);
    status.textContent = '✅ Paramètres téléchargés.';
    status.style.color = '#1a7a4a';
  });
}

// ─── Export des identifiants ──────────────────────────────────────────────

function initExportCredentials() {
  document.getElementById('btn-export-creds').addEventListener('click', exportCredentials);
}

async function exportCredentials() {
  const status  = document.getElementById('creds-export-status');
  const pwdInput = document.getElementById('export-master-pwd');
  const masterPwd = pwdInput ? pwdInput.value : '';

  status.textContent = '';
  status.style.color = '';

  const stored = await chrome.storage.local.get({ [VAULT_KEY]: null });

  // Pas de coffre : exporte un tableau vide avec un avertissement
  if (!stored[VAULT_KEY]) {
    const exportData = {
      _meta: { exportedAt: new Date().toISOString(), type: 'faciliweb-credentials' },
      credentials: []
    };
    downloadJSON(exportData, `faciliweb-identifiants-${dateStamp()}.json`);
    status.textContent = '✅ Aucun identifiant enregistré — fichier vide téléchargé.';
    status.style.color = '#1a7a4a';
    return;
  }

  if (!masterPwd) {
    status.textContent = '⚠️ Entrez votre mot de passe maître pour déchiffrer.';
    status.style.color = '#d4640a';
    pwdInput.focus();
    return;
  }

  status.textContent = '⏳ Déchiffrement en cours...';

  const result = await FW_CRYPTO.unlockVault(stored[VAULT_KEY], masterPwd);

  if (!result) {
    status.textContent = '❌ Mot de passe maître incorrect.';
    status.style.color = '#c0392b';
    pwdInput.value = '';
    pwdInput.focus();
    return;
  }

  const exportData = {
    _meta: {
      exportedAt: new Date().toISOString(),
      extensionVersion: chrome.runtime.getManifest().version,
      type: 'faciliweb-credentials',
      count: result.entries.length
    },
    credentials: result.entries
  };

  downloadJSON(exportData, `faciliweb-identifiants-${dateStamp()}.json`);
  status.textContent = `✅ ${result.entries.length} identifiant(s) téléchargé(s).`;
  status.style.color = '#1a7a4a';
  pwdInput.value = '';
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
