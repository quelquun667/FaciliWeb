# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et le versionnement suit [Semantic Versioning](https://semver.org/lang/fr/).

> Ce fichier est mis à jour automatiquement à chaque release par le workflow GitHub Actions.

---

## [1.0.0] — 2026-05-19

### Ajouté
- Protection anti-hameçonnage avec liste noire mise à jour automatiquement toutes les 6h
- Vérificateur d'orthographe de domaine (distance de Levenshtein sur 45 domaines canoniques)
- Vérificateur de pièces jointes dangereuses (22 extensions surveillées)
- Alerte fuite de données via HaveIBeenPwned
- Analyse de liens via menu contextuel (clic droit)
- Gestionnaire d'identifiants chiffré AES-256-GCM avec mot de passe maître
- Générateur de mots de passe cryptographiquement sécurisé
- Indicateur de force de mot de passe en temps réel
- Auto-complétion et proposition de sauvegarde des identifiants
- Import / Export des identifiants en JSON
- Badge CapsLock discret collé au champ de saisie actif
- Panneau de 74 caractères spéciaux organisés en 7 catégories
- Traducteur de jargon technique au survol (15 termes)
- Détecteur de captcha avec message pédagogique
- Décomposition pédagogique de l'URL courante dans la popup
- Tutoriel premier démarrage en 9 slides (s'ouvre à l'installation)
- Annuaire de ~30 sites utiles avec guides d'utilisation intégrés
- 12 mini-guides pratiques illustrés (copier, clic droit, traduire…)
- Page de 27 raccourcis clavier essentiels
- Glossaire visuel de 6 types d'arnaques annotées
- Page d'aide décrivant chaque fonctionnalité
- Pause écran configurable avec notification récurrente
- Carnet de notes sauvegardé automatiquement
- Résumé hebdomadaire (top 3 des sites visités)
- Thème sombre synchronisé sur toutes les pages internes
- Popup à onglets (Accueil / Outils / Paramètres)
- Support Manifest V3 — Chrome, Edge, Brave, Opera
- Localisation FR / EN via chrome.i18n
