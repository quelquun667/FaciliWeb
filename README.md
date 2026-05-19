# 🛡️ FaciliWeb

**FR** | [EN](#english-version)

> Extension de navigateur conçue pour rendre la navigation web plus sûre, plus simple et pédagogique — spécialement pour les personnes débutantes ou mal à l'aise avec l'outil informatique.

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔤 **Alerte Majuscules** | Avertissement visuel si le Verr. Maj. est activé lors d'une saisie |
| 🟢 **Surlignage des champs** | Encadre les champs en vert (normal) ou orange (sensible) |
| ✨ **Caractères spéciaux** | Bouton flottant pour insérer @, €, #, etc. avec guide clavier |
| 🛡️ **Anti-hameçonnage** | Alerte plein écran si le site est dans une liste noire |
| 📖 **Traducteur de jargon** | Définitions simplifiées des termes techniques au survol |
| 🔑 **Gestionnaire d'identifiants** | Stockage sécurisé local et remplissage simplifié |
| 🔍 **Analyse de liens** | Analysez un lien avant de cliquer via le clic droit |

## Installation (mode développeur)

1. Téléchargez ou clonez ce dépôt sur votre ordinateur.
2. Ouvrez votre navigateur (Chrome, Edge, Brave, Opera).
3. Naviguez vers `chrome://extensions/` dans la barre d'adresse.
4. Activez le **Mode développeur** (interrupteur en haut à droite).
5. Cliquez sur **Charger l'extension non empaquetée**.
6. Sélectionnez le dossier `FaciliWeb`.
7. L'extension est installée ! Cliquez sur l'icône 🛡️ dans la barre d'outils.

## Structure du projet

```
FaciliWeb/
├── _locales/          # Traductions FR/EN
├── assets/            # Icônes
├── popup/             # Interface principale (clic sur l'icône)
├── settings/          # Page des paramètres
├── scripts/           # Scripts de contenu et background
└── manifest.json      # Configuration de l'extension
```

## Compatibilité

- Google Chrome 88+
- Microsoft Edge 88+
- Brave Browser
- Opera 74+

---

## English version

> Browser extension designed to make web browsing safer, simpler and more educational — especially for beginners or people uncomfortable with digital tools.

### Features

| Feature | Description |
|---|---|
| 🔤 **Caps Lock Alert** | Visual warning when Caps Lock is on while typing |
| 🟢 **Field Highlighter** | Outlines fields in green (normal) or orange (sensitive) |
| ✨ **Special Characters** | Floating button to insert @, €, # etc. with keyboard guide |
| 🛡️ **Anti-Phishing** | Full-screen alert for known phishing domains |
| 📖 **Jargon Translator** | Simplified definitions of technical terms on hover |
| 🔑 **Credential Manager** | Secure local storage and simplified form filling |
| 🔍 **Link Analyser** | Right-click a link to check it before clicking |

### Installation (developer mode)

1. Download or clone this repository.
2. Open your browser (Chrome, Edge, Brave, Opera).
3. Navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in the top right).
5. Click **Load unpacked**.
6. Select the `FaciliWeb` folder.
7. Done! Click the 🛡️ icon in the toolbar.

---

*Manifest V3 · Vanilla JS · No external dependencies*
