# أذكار الصباح والمساء — Azkar App

Application web (PWA) permettant de lire, écouter et compter les adhkar
du matin et du soir, avec suivi de progression, favoris et statistiques.

## 🚀 Installation / Lancement local

Aucune dépendance ni build n'est nécessaire (HTML/CSS/JS natifs). Il faut
simplement servir les fichiers via un serveur HTTP local (les Service
Workers ne fonctionnent pas sur `file://`).

```bash
cd Azkar-App

# Option 1 — Python
python3 -m http.server 8080

# Option 2 — Node (http-server)
npx http-server -p 8080

# puis ouvrir : http://localhost:8080
```

Pour publier l'app (GitHub Pages, Netlify, Vercel, etc.) il suffit de
déposer le contenu du dossier `Azkar-App/` tel quel — c'est un site
statique.

## 🗂️ Architecture du projet

```
Azkar-App/
├── index.html          → structure de la page, RTL, 4 vues (matin/soir/favoris/stats)
├── manifest.json        → métadonnées PWA (icônes, couleurs, mode standalone)
├── sw.js                 → Service Worker : cache-first + repli réseau (hors ligne)
├── css/
│   └── style.css        → design system complet (tokens CSS, thème clair/sombre, RTL)
├── js/
│   ├── azkar.js         → données : tous les adhkar (texte, traduction, source, répétitions)
│   ├── storage.js       → couche d'abstraction localStorage (clés centralisées)
│   ├── audio.js         → sons de clic/validation, vibration, lecture vocale (Web Speech API)
│   └── app.js           → logique principale : rendu, compteurs, onglets, recherche, stats
└── assets/
    ├── images/          → icônes de l'app (à remplacer par de vraies icônes 192/512px)
    └── sounds/           → dossier prévu pour de vrais fichiers audio récités (mp3)
```

### Pourquoi cette architecture ?

- **Séparation des données et de la logique** : `azkar.js` ne contient
  que des données brutes, ce qui permet de les modifier, traduire ou
  enrichir sans toucher au code applicatif.
- **`storage.js` centralise les clés localStorage** pour éviter les
  fautes de frappe et faciliter une migration future (ex. IndexedDB ou
  synchronisation cloud).
- **`audio.js` est autonome** : il utilise la Web Speech API pour lire
  les adhkar à voix haute sans nécessiter de fichiers audio lourds. Pour
  une vraie récitation professionnelle, il suffit de déposer des `.mp3`
  dans `assets/sounds/` et de brancher un `<audio>` dans `handlePlay()`
  (voir suggestions ci-dessous).
- **`app.js` utilise la délégation d'événements** (un seul listener par
  grille) plutôt qu'un listener par carte, pour rester performant même
  avec de nombreux adhkar affichés.
- **Aucun framework** : le cahier des charges imposait du JavaScript
  natif ; le code est organisé en IIFE + fonctions pures autant que
  possible pour rester lisible et testable.

## ✅ Fonctionnalités livrées

- Interface moderne, glassmorphism, motif géométrique islamique en
  filigrane, palette vert islamique / or / ivoire, mode sombre complet.
- Deux sections principales (Matin 🌅 / Soir 🌙) + Favoris ⭐ + Statistiques 📊.
- Cartes de dhikr avec texte arabe, traduction, source, compteur
  circulaire animé, bouton "سبح", copier, partager, lecture audio.
- Compteur intelligent : le dhikr passe en état "terminé" (couleur,
  badge, bouton désactivé) une fois l'objectif atteint ; vibration et
  son de validation.
- Sauvegarde complète via `localStorage` : compteurs, dernier onglet,
  thème, favoris, paramètres, statistiques.
- Recherche instantanée dans le texte arabe et la traduction.
- Statistiques : dhikr complétés aujourd'hui, série de jours
  consécutifs, temps estimé, activité des 7 derniers jours.
- Notifications de rappel programmables (heure du matin / heure du soir).
- PWA installable avec fonctionnement hors ligne (`manifest.json` + `sw.js`).
- Code commenté, modulaire, sans duplication, noms de variables explicites.

## 🔮 Suggestions d'amélioration futures

1. **Remplacer la synthèse vocale par de vraies récitations audio**
   (fichiers `.mp3` d'un récitateur) stockées dans `assets/sounds/` pour
   une expérience plus authentique et disponible hors ligne sans dépendre
   du moteur TTS du navigateur.
2. **Ajouter un vrai système d'icônes PWA** (192×192 et 512×512, format
   maskable) — les fichiers actuels dans `assets/images/` sont des
   placeholders à remplacer avant publication sur un store.
3. **Multilingue complet** : actuellement seule la traduction française
   est prévue par dhikr ; on pourrait ajouter un sélecteur de langue
   (anglais, espagnol, etc.) et une traduction phonétique en alphabet latin.
4. **Widget "dhikr du jour"** pour l'écran d'accueil mobile (via
   Web App Manifest shortcuts ou une future version native).
5. **Synchronisation multi-appareils** en connectant l'app à un backend
   léger (ex. Firebase, Supabase) pour ne plus dépendre uniquement du
   `localStorage` local à un navigateur.
6. **Mode "session guidée"** : enchaîner automatiquement tous les
   adhkar d'une section avec transition automatique et minuteur, pour
   une lecture mains libres.
7. **Rappels plus robustes** : les notifications actuelles nécessitent
   que l'onglet reste ouvert (`setInterval`) ; une vraie app publiée
   utiliserait les Notifications Push + Service Worker en arrière-plan.
8. **Tests automatisés** (Jest ou Vitest) sur la logique de compteur,
   de séries de jours et de filtrage de recherche.
9. **Accessibilité renforcée** : lecteurs d'écran arabophones, ordre de
   tabulation optimisé, mode "grande police" pour les personnes âgées.
10. **Empaquetage natif** via Capacitor/Cordova ou TWA (Trusted Web
    Activity) pour une publication directe sur le Google Play Store.

## 📌 Notes importantes

- Les textes des adhkar proviennent des sources traditionnelles
  authentiques (Coran et Sunna, référencées individuellement dans
  `azkar.js`). Il est recommandé de faire relire le contenu par une
  personne qualifiée avant toute publication publique, comme pour tout
  contenu religieux diffusé à grande échelle.
- L'application est entièrement fonctionnelle sans backend : toutes les
  données utilisateur restent en local, sur l'appareil de la personne.
