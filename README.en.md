<div align="center">
  <img src="assets/icon.svg" width="90" alt="FaciliWeb logo" />
  <h1>FaciliWeb</h1>
  <p><strong>Browser extension for safer and more accessible web browsing</strong></p>

  [![Version](https://img.shields.io/github/v/release/noahgranizo/FaciliWeb?label=version&color=1a5fa8)](https://github.com/noahgranizo/FaciliWeb/releases)
  [![MIT Licence](https://img.shields.io/badge/licence-MIT-green)](LICENSE)
  [![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
  [![Version française](https://img.shields.io/badge/README-Français-lightgrey)](README.md)
</div>

---

> Manifest V3 browser extension designed to make web browsing **safer, simpler and more educational** — especially for beginners or people uncomfortable with digital tools.

---

## ✨ Features

### 🛡️ Security
| Feature | Description |
|---|---|
| **Anti-phishing** | Blacklist updated automatically every 6h — full-screen alert on suspicious sites |
| **Domain typo checker** | Detects close variants of official domains (`paypa1.com` → `paypal.com`) |
| **Attachment checker** | ⚠️ badge on links pointing to dangerous files (.exe, .scr, .zip…) |
| **Data breach alert** | Email check via HaveIBeenPwned in one click |
| **Link analyser** | Right-click any link → domain analysis before clicking |

### 🔑 Credentials
| Feature | Description |
|---|---|
| **AES-256-GCM encrypted vault** | Passwords protected by a master password (never stored) |
| **Auto-fill** | Saved credentials suggested on username field focus |
| **Auto-save** | Save prompt after login form submission |
| **Password generator** | Cryptographic generation with options (length, symbols…) |
| **Strength indicator** | Real-time colour bar on every password field |
| **Import / Export** | Transfer credentials between devices via JSON file |

### 🧰 Typing comfort
| Feature | Description |
|---|---|
| **Caps Lock alert** | Orange badge next to the active field when Caps Lock is on |
| **Special characters** | 74 characters in 7 categories with keyboard shortcut guide |
| **Field highlighter** | Green (normal) or orange (sensitive) outline on focused fields |
| **Jargon translator** | Hover definitions for phishing, cookie, VPN, 2FA… |
| **Captcha detector** | Reassuring message when a "I'm not a robot" test appears |
| **URL decomposition** | Each address part explained with colour coding |

### 📚 Tools & education
| Feature | Description |
|---|---|
| **Useful sites directory** | ~30 verified sites (translation, spell check, public services…) with usage guides |
| **Quick practical guides** | 12 illustrated guides (copy, right-click, translate, zoom, screenshot…) |
| **Keyboard shortcuts** | 27 essential shortcuts by category with visual key layouts |
| **First-launch tutorial** | 9 slides introducing every feature on install |
| **Scam glossary** | 6 annotated examples of fake emails, SMS, fraudulent popups |

### ⚙️ Settings & management
| Feature | Description |
|---|---|
| **Screen break timer** | Configurable recurring notification (1–240 min) |
| **Notes pad** | Local notepad auto-saved |
| **Weekly summary** | Top 3 visited sites each week |
| **Dark mode** | Light or dark theme, synced across all internal pages |
| **In-popup settings** | All toggles accessible without leaving the popup |

---

## 📦 Installation

### Via GitHub Releases (recommended)

1. Download `faciliweb-x.x.x.zip` from the [latest release](https://github.com/noahgranizo/FaciliWeb/releases/latest).
2. Unzip the archive on your computer.
3. Open `chrome://extensions/` in your browser.
4. Enable **Developer mode** (toggle in the top right).
5. Click **Load unpacked** and select the unzipped folder.
6. The 🛡️ icon appears in the toolbar — you're ready!

### Via source code (developers)

```bash
git clone https://github.com/noahgranizo/FaciliWeb.git
```

Then follow steps 3–6 above pointing to the cloned folder.

---

## 🗂️ Project structure

```
FaciliWeb/
├── _locales/          # FR / EN translations (chrome.i18n)
├── assets/            # PNG and SVG icons
├── annuaire/          # Useful sites directory
├── glossary/          # Visual scam glossary
├── guides/            # Illustrated practical guides
├── help/              # Per-feature help page
├── onboarding/        # First-launch tutorial
├── passwords/         # Encrypted credential manager
├── popup/             # Popup UI (Home / Tools / Settings tabs)
├── scripts/
│   ├── background.js  # Service Worker (security, alarms, phishing)
│   ├── content.js     # Visual injections on web pages
│   ├── crypto.js      # AES-256-GCM encryption
│   ├── generator.js   # Password generator
│   ├── helpers.js     # Shared utilities
│   └── theme.js       # Theme application on internal pages
├── shortcuts/         # Keyboard shortcuts page
└── manifest.json      # Manifest V3 configuration
```

---

## 🔄 Releases & versioning

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Example | Version effect |
|---|---|---|
| `feat:` | `feat: add reader mode` | **Minor** bump (1.0.0 → 1.1.0) |
| `fix:` / `perf:` | `fix: caps lock badge positioning` | **Patch** bump (1.0.0 → 1.0.1) |
| `feat!:` | `feat!: new encryption system` | **Major** bump (1.0.0 → 2.0.0) |
| `chore:` `docs:` `refactor:` | — | No release |

Every push to `main` with a `feat:` or `fix:` prefix automatically creates a tag, generates the changelog and publishes a GitHub release with the extension ZIP.

---

## 🖥️ Compatibility

| Browser | Minimum version |
|---|---|
| Google Chrome | 88+ |
| Microsoft Edge | 88+ |
| Brave Browser | all |
| Opera | 74+ |

---

## 📝 Licence

[MIT](LICENSE) — Open-source project, contributions welcome.

---

<div align="center">
  <sub>Manifest V3 · Vanilla JS · No external dependencies</sub>
</div>
