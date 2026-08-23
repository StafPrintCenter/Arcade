# STAF Arcade Hub

# PROMPT : DEVELOPPEMENT DE "SPC ARCADE" (LE HUB DE JEUX ET GAMIFICATION DE STAF PRINT CENTER)

Tu es un développeur Full-Stack Senior & Lead Game Designer Expert React / TypeScript / TailwindCSS.

Tu dois construire une WebApp moderne, immersive, performante et production-ready nommée **SPC Arcade** (accessible via `play.stafprint.com` ou `/arcade`), le hub de jeux et de gamification officiel de l'entreprise **STAF PRINT CENTER** (Porto-Novo, Bénin).

---

## 🎨 1. DESIGN SYSTEM & CHARTE GRAPHIQUE (STRICTE)

L'interface doit respecter rigoureusement la charte graphique officielle de STAF PRINT CENTER :

- **Palette de Couleurs :**

  - **Background :** Off-white chaud / Slate très clair avec motifs de grille fine (Paper Grid style) pour le mode clair, Slate profond (`#0f172a` / `#1e293b`) pour l'ambiance Arcade Dark Mode.

  - **Couleur Primaire / Accent STAF PRINT :** Orange Vibrant / Ambre signature (`#f97316` / `#ea580c`) pour les boutons d'action, jauges d'XP, scores et animations de victoire.

  - **Accents secondaires :** Vert émeraude (réussite, gain de points), Violet/Indigo (succès rares/badges).

- **Typographies :**

  - **Fraunces** (`--font-display`) pour les titres, niveaux, scores et en-têtes de jeux.

  - **Inter Tight** pour l'interface utilisateur, la navigation, les explications et consignes.

- **Esthétique :**

  - Style SaaS / Arcade moderne : cartes rétro-futurologiques épurées, angles adoucis (`rounded-2xl`), effets de lumière au survol (hover glow), badges néon, micro-animations fluides (`Framer Motion`).

---

## 💾 2. ARCHITECTURE TECHNIQUE & LOCALSTORAGE

- **Stack :** React (Vite ou TanStack Router), TypeScript strict, TailwindCSS v4, Lucide React icons, Framer Motion, Canvas-confetti (pour la célébration des victoires).

- **Gestion des données (100% Client-Side / LocalStorage) :**

  - Pas d'API backend requise pour l'instant. Toute la progression, les points, les badges et le profil joueur sont sauvegardés et synchronisés localement via un Custom Hook React (`useArcadeProfile`).

  - Structure des données dans `localStorage` (`spc_arcade_profile`) :

    ```typescript

    interface ArcadeProfile {

      nickname: string;

      totalXP: number;

      level: number;

      unlockedTitle: string;

      unlockedBadges: string[];

      gamesData: {

        printingMaster: { highScore: number; levelsCompleted: number };

        studioManager: { maxReputation: number; totalRevenue: number; bestRunDays: number };

        webQuest: { completedChapters: string[]; bestTimeSeconds: number };

        skillArcade: { minigamesPlayed: number; bestStreak: number };

      };

      history: Array<{ gameId: string; xpEarned: number; timestamp: string }>;

    }

    ```

---

## 🎮 3. LES 4 JEUX EMBARQUÉS DANS LE HUB

### 🕹️ Jeu 1 : STAF Printing & Prepress Master (Jeu d'Expertise Prépresse)

* **Concept :** Un jeu d'analyse et d'inspection de fichiers graphiques avant impression.

* **Gameplay :**

  - Le joueur reçoit des commandes clients avec des fichiers virtuels présentant des erreurs d'imprimerie.

  - **Missions :** Détecter la mauvaise résolution (ex: 72 DPI au lieu de 300 DPI), corriger l'absence de fond perdu (*bleed*), convertir un profil RVB en CMJN, repérer du texte non vectorisé ou ajuster le choix du support (Papier couché 350g, Bâche PVC, Vinyle adhésif).

  - Validation du bon de à tirer (BAT) : +XP par fichier correctement corrigé, pénalité en cas d'impression d'un fichier défectueux.

### 🏢 Jeu 2 : STAF Studio Manager (Simulation & Gestion d'Agence)

* **Concept :** Un jeu de gestion de type *Tycoon* / Simulation d'agence créative.

* **Gameplay :**

  - Le joueur gère son agence STAF PRINT CENTER sur une période donnée (ex: 30 jours).

  - **Missions :** Accepter des contrats clients (enseigne lumineuse, impression de badges, création de site web e-commerce, habillage véhicule).

  - Allocation du temps et des ressources (Graphiste, Développeur Web, Opérateur Impression), gestion du budget et achat de meilleures machines.

  - Équilibre entre satisfaction client, respect des délais (deadlines) et rentabilité financiale.

### 🧩 Jeu 3 : Print & Web Quest (Escape Game Virtuel Pédagogique)

* **Concept :** Un jeu d'aventure narrative et d'énigmes interactives par étapes.

* **Gameplay :**

  - Un projet majeur d'un client VIP doit être livré dans 15 minutes, mais le système est bloqué !

  - **Énigmes à résoudre :** 

    1. *Étape 1 (Design) :* Retrouver le bon code couleur hexadécimal/CMJN de la charte STAF.

    2. *Étape 2 (Web) :* Débugger une ligne de CSS/Flexbox pour réaligner le bouton de commande.

    3. *Étape 3 (Impression) :* Calibrer la découpe vectorielle sur le traceur.

  - Chronomètre global, indices disponibles contre de l'XP.

### 🎯 Jeu 4 : STAF Skill Badges & Arcade (Micro-défis Rapides)

* **Concept :** Un hub de mini-jeux style "WarioWare" pour évaluer la rapidité et la précision.

* **Gameplay :**

  - **Mini-jeu A (Color Matcher) :** Recréer une teinte exacte en ajustant les curseurs Cyan, Magenta, Jaune, Noir (CMJN).

  - **Mini-jeu B (Speed Typography) :** Identifier la bonne famille de police (Serif, Sans-Serif, Display, Script) en moins de 3 secondes.

  - **Mini-jeu C (Layout Fixer) :** Glisser-déposer les éléments d'une bannière pour respecter la règle des tiers et la hiérarchie visuelle.

---

## 📱 4. STRUCTURE DES ÉCRANS DU HUB

### 1. Page d'Accueil & Menu Principal (`/arcade`)

- **Header du Hub :**

  - Logo officiel **SPC Arcade** avec effets néon/orange.

  - Carte Profil Joueur : Avatar, Pseudo, Barre de progression XP, Niveau actuel (ex. *Niveau 3 : Technicien PAO*), Total d'XP accumulé.

- **Catalogue des Jeux (Grille de cartes interactives) :**

  - Cartes pour chacun des 4 jeux avec visuel, catégorie, difficulté, meilleur score personnel et bouton "Jouer".

- **Section Badges & Trophées Unlocked :**

  - Grille des succès à débloquer (ex: *"Maître CMJN"*, *"Directeur d'Agence"*, *"Pixel Perfect"*, *"Légende STAF"*).

- **Classement Local (Leaderboard) :**

  - Historique des meilleures sessions et accomplissements récents.

### 2. Interface Unifiée des Jeux (`/arcade/play/$gameId`)

- Barre supérieure permanente : Bouton "Quitter vers le Hub", Nom du jeu, Score de la session en cours, Chronomètre / Vies.

- Zone centrale : Composant dynamique du jeu sélectionné.

- Modale de Fin de Partie (Victory / Game Over) :

  - Calcul de l'XP gagnée.

  - Animation de confettis si nouveau record ou badge débloqué.

  - Boutons "Rejouer" ou "Retour au Hub".

---

## 📂 5. ARCHITECTURE TECHNIQUE ET FICHIERS

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4f24a1dd-8efc-484e-a5bb-2dcaf3bda2e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
