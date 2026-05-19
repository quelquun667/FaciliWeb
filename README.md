<div align="center">
  <img src="assets/icon.svg" width="90" alt="Logo FaciliWeb" />
  <h1>FaciliWeb</h1>
  <p><strong>Extension de navigateur pour une navigation plus sûre et accessible</strong></p>

  [![Version](https://img.shields.io/github/v/release/noahgranizo/FaciliWeb?label=version&color=1a5fa8)](https://github.com/noahgranizo/FaciliWeb/releases)
  [![Licence MIT](https://img.shields.io/badge/licence-MIT-green)](LICENSE)
  [![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
  [![English version](https://img.shields.io/badge/README-English-lightgrey)](README.en.md)
</div>

---

> Extension navigateur Manifest V3 conçue pour rendre la navigation web **plus sûre, plus simple et pédagogique** — spécialement pour les personnes débutantes ou mal à l'aise avec l'outil informatique.

---

## ✨ Fonctionnalités

### 🛡️ Sécurité
| Fonctionnalité | Description |
|---|---|
| **Anti-hameçonnage** | Liste noire mise à jour automatiquement toutes les 6h — alerte plein écran si le site est suspect |
| **Vérificateur d'orthographe de domaine** | Détecte les variantes proches des domaines officiels (`paypa1.com` → `paypal.com`) |
| **Vérificateur de pièces jointes** | Badge ⚠️ sur les liens vers des fichiers dangereux (.exe, .scr, .zip…) |
| **Alerte fuite de données** | Vérification de l'email via HaveIBeenPwned en un clic |
| **Analyse de liens** | Clic droit sur un lien → analyse du domaine avant de cliquer |

### 🔑 Identifiants
| Fonctionnalité | Description |
|---|---|
| **Coffre chiffré AES-256-GCM** | Mots de passe protégés par un mot de passe maître (jamais stocké) |
| **Remplissage automatique** | Suggestion des identifiants enregistrés au focus du champ utilisateur |
| **Sauvegarde automatique** | Proposition d'enregistrement après soumission d'un formulaire de connexion |
| **Générateur de mot de passe** | Génération cryptographique avec options (longueur, symboles…) |
| **Indicateur de force** | Barre colorée en temps réel sur chaque champ mot de passe |
| **Import / Export** | Transfert des identifiants entre appareils via fichier JSON |

### 🧰 Confort de saisie
| Fonctionnalité | Description |
|---|---|
| **Alerte Majuscules** | Badge orange collé au champ actif si Verr. Maj. est activé |
| **Caractères spéciaux** | 74 caractères en 7 catégories avec guide des raccourcis clavier |
| **Surlignage des champs** | Encadre les champs en vert (normal) ou orange (sensible) |
| **Traducteur de jargon** | Définitions au survol pour phishing, cookie, VPN, 2FA… |
| **Détecteur de captcha** | Message rassurant quand un test "je ne suis pas un robot" apparaît |
| **Décomposition d'URL** | Chaque partie de l'adresse expliquée avec un code couleur |

### 📚 Outils & pédagogie
| Fonctionnalité | Description |
|---|---|
| **Annuaire des sites utiles** | ~30 sites vérifiés (traduction, correcteurs, services publics…) avec guides d'utilisation |
| **Mini-guides pratiques** | 12 guides illustrés (copier, clic droit, traduire, zoomer, capture d'écran…) |
| **Raccourcis clavier** | 27 raccourcis essentiels par catégorie, visuels clavier inclus |
| **Tutoriel premier démarrage** | 9 slides présentant chaque fonctionnalité à l'installation |
| **Glossaire des arnaques** | 6 exemples annotés de faux mails, SMS, popups frauduleux |

### ⚙️ Gestion & paramètres
| Fonctionnalité | Description |
|---|---|
| **Pause écran** | Notification récurrente configurable (1–240 min) |
| **Carnet de notes** | Bloc-notes local sauvegardé automatiquement |
| **Résumé hebdomadaire** | Top 3 des sites visités chaque semaine |
| **Thème sombre** | Interface claire ou sombre, synchronisée sur toutes les pages |
| **Paramètres dans la popup** | Tous les toggles accessibles sans quitter la popup |

---

## 📦 Installation

### Via GitHub Releases (recommandé)

1. Téléchargez le fichier `faciliweb-x.x.x.zip` depuis la [dernière release](https://github.com/noahgranizo/FaciliWeb/releases/latest).
2. Décompressez l'archive sur votre ordinateur.
3. Ouvrez `chrome://extensions/` dans votre navigateur.
4. Activez le **Mode développeur** (interrupteur en haut à droite).
5. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez le dossier décompressé.
6. L'icône 🛡️ apparaît dans la barre d'outils — c'est prêt !

### Via le code source (développeurs)

```bash
git clone https://github.com/noahgranizo/FaciliWeb.git
```

Puis suivez les étapes 3 à 6 ci-dessus en pointant vers le dossier cloné.

---

## 🗂️ Structure du projet

```
FaciliWeb/
├── _locales/          # Traductions FR / EN (chrome.i18n)
├── assets/            # Icônes PNG et SVG
├── annuaire/          # Annuaire des sites utiles
├── glossary/          # Glossaire visuel des arnaques
├── guides/            # Mini-guides pratiques illustrés
├── help/              # Page d'aide par fonctionnalité
├── onboarding/        # Tutoriel premier démarrage
├── passwords/         # Gestionnaire d'identifiants chiffré
├── popup/             # Interface popup (onglets Accueil / Outils / Paramètres)
├── scripts/
│   ├── background.js  # Service Worker (sécurité, alarmes, phishing)
│   ├── content.js     # Injections visuelles sur les pages
│   ├── crypto.js      # Chiffrement AES-256-GCM
│   ├── generator.js   # Générateur de mots de passe
│   ├── helpers.js     # Utilitaires partagés
│   └── theme.js       # Application du thème sur les pages internes
├── shortcuts/         # Page raccourcis clavier
└── manifest.json      # Configuration Manifest V3
```

---

## 🔄 Releases et versionnement

Ce projet suit la convention [Conventional Commits](https://www.conventionalcommits.org/) :

| Préfixe | Exemple | Effet sur la version |
|---|---|---|
| `feat:` | `feat: ajouter le mode lecture` | Bump **mineur** (1.0.0 → 1.1.0) |
| `fix:` / `perf:` | `fix: corriger le badge CapsLock` | Bump **patch** (1.0.0 → 1.0.1) |
| `feat!:` | `feat!: nouveau système de chiffrement` | Bump **majeur** (1.0.0 → 2.0.0) |
| `chore:` `docs:` `refactor:` | — | Pas de release |

Chaque push sur `main` avec un préfixe `feat:` ou `fix:` crée automatiquement un tag, génère le changelog et publie une release GitHub avec le ZIP de l'extension.

---

## 🖥️ Compatibilité

| Navigateur | Version minimale |
|---|---|
| Google Chrome | 88+ |
| Microsoft Edge | 88+ |
| Brave Browser | toutes |
| Opera | 74+ |

---

## 📝 Licence

[MIT](LICENSE) — Projet open-source, contributions bienvenues.

---

<div align="center">
  <sub>Manifest V3 · Vanilla JS · Aucune dépendance externe</sub>
</div>
