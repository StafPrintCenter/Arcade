import type { ArcadeProfile, GameId } from "./types";

export const STORAGE_KEY = "spc_arcade_profile";

export const LEVELS: Array<{ level: number; xp: number; title: string }> = [
  { level: 1, xp: 0, title: "Stagiaire Studio" },
  { level: 2, xp: 150, title: "Assistant PAO" },
  { level: 3, xp: 400, title: "Technicien PAO" },
  { level: 4, xp: 800, title: "Infographiste Senior" },
  { level: 5, xp: 1400, title: "Chef de Fabrication" },
  { level: 6, xp: 2200, title: "Directeur Artistique" },
  { level: 7, xp: 3200, title: "Légende STAF" },
];

export function levelFromXP(xp: number) {
  let current = LEVELS[0]!;
  for (const l of LEVELS) if (xp >= l.xp) current = l;
  const next = LEVELS.find((l) => l.xp > xp);
  const span = next ? next.xp - current.xp : 1;
  const progress = next ? Math.min(100, Math.round(((xp - current.xp) / span) * 100)) : 100;
  return { ...current, next, progress };
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  rarity: "commun" | "rare" | "legendaire";
}

export const BADGES: BadgeDef[] = [
  { id: "first-print", name: "Premier Tirage", description: "Terminer une première partie", rarity: "commun" },
  { id: "maitre-cmjn", name: "Maître CMJN", description: "Réussir un Color Match parfait", rarity: "rare" },
  { id: "pixel-perfect", name: "Pixel Perfect", description: "Valider 5 BAT sans erreur", rarity: "rare" },
  { id: "bat-clean", name: "BAT Impeccable", description: "Terminer Prepress Master sans pénalité", rarity: "rare" },
  { id: "directeur-agence", name: "Directeur d'Agence", description: "Atteindre 80 de réputation en simulation", rarity: "rare" },
  { id: "millionnaire", name: "Trésorier", description: "Dépasser 2 000 000 FCFA de chiffre d'affaires", rarity: "rare" },
  { id: "escape-artist", name: "Escape Artist", description: "Terminer Print & Web Quest", rarity: "rare" },
  { id: "sans-indice", name: "Sans Indice", description: "Finir la Quest sans aucun indice", rarity: "legendaire" },
  { id: "serie-10", name: "Série de 10", description: "10 micro-défis réussis d'affilée", rarity: "legendaire" },
  { id: "legende-staf", name: "Légende STAF", description: "Atteindre le niveau 7", rarity: "legendaire" },
  { id: "webmaster", name: "Webmaster", description: "Livrer un site parfait en simulation", rarity: "rare" },
  { id: "oeil-de-lynx", name: "Œil de Lynx", description: "Trouver toutes les erreurs d'une composition", rarity: "rare" },
  { id: "pixel-artiste", name: "Pixel Artiste", description: "Reproduire une image en 16x16 ou plus", rarity: "legendaire" },
  { id: "detourage-pro", name: "Détourage Pro", description: "Réussir un détourage sans bavure", rarity: "rare" },
];

export interface GameDef {
  id: GameId;
  name: string;
  tagline: string;
  category: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  accent: string;
  icon: "printer" | "building" | "puzzle" | "target" | "layout" | "palette" | "search" | "grid" | "shapes" | "eraser";
}

export const GAMES: GameDef[] = [
  {
    id: "printingMaster",
    name: "Printing & Prepress Master",
    tagline: "Inspectez les fichiers clients et validez le BAT avant tirage.",
    category: "Expertise Prépresse",
    difficulty: "Moyen",
    accent: "primary",
    icon: "printer",
  },
  {
    id: "studioManager",
    name: "STAF Studio Manager",
    tagline: "Gérez l'agence sur 30 jours : contrats, équipe, budget, réputation.",
    category: "Simulation / Tycoon",
    difficulty: "Difficile",
    accent: "rare",
    icon: "building",
  },
  {
    id: "webQuest",
    name: "Print & Web Quest",
    tagline: "Escape game : 3 énigmes, un chrono, un client VIP impatient.",
    category: "Énigmes / Aventure",
    difficulty: "Moyen",
    accent: "success",
    icon: "puzzle",
  },
  {
    id: "skillArcade",
    name: "Skill Badges & Arcade",
    tagline: "Micro-défis rapides : couleur, typographie, mise en page.",
    category: "Arcade / Réflexes",
    difficulty: "Facile",
    accent: "primary",
    icon: "target",
  },
  {
    id: "webBuilder",
    name: "Web Builder Simulator",
    tagline: "Composez un site client : structure, couleurs, typo, CTA et responsive.",
    category: "Simulation Web",
    difficulty: "Moyen",
    accent: "primary",
    icon: "layout",
  },
  {
    id: "visualCreator",
    name: "Visuel Express",
    tagline: "Créez un visuel simple : format, fond, hiérarchie du texte et logo.",
    category: "Création Graphique",
    difficulty: "Facile",
    accent: "success",
    icon: "palette",
  },
  {
    id: "errorHunt",
    name: "Chasse aux Erreurs",
    tagline: "Repérez alignements, contrastes, hiérarchies et couleurs incohérentes.",
    category: "Œil du Graphiste",
    difficulty: "Moyen",
    accent: "rare",
    icon: "search",
  },
  {
    id: "pixelArt",
    name: "Pixel Reproduction",
    tagline: "Reproduisez l'image modèle case par case : 8x8, 16x16 ou 32x32.",
    category: "Précision / Patience",
    difficulty: "Difficile",
    accent: "primary",
    icon: "grid",
  },
  {
    id: "logoSteps",
    name: "Logo Rebuild",
    tagline: "Remettez dans l'ordre les étapes de création d'un logo fictif.",
    category: "Méthode / Branding",
    difficulty: "Moyen",
    accent: "success",
    icon: "shapes",
  },
  {
    id: "backEraser",
    name: "Back Eraser",
    tagline: "Détourez le sujet : effacez l'arrière-plan sans mordre sur le sujet.",
    category: "Retouche Photo",
    difficulty: "Facile",
    accent: "rare",
    icon: "eraser",
  },
];

export const GENDERS: Array<{ id: import("./types").Gender; label: string; emoji: string }> = [
  { id: "homme", label: "Homme", emoji: "👨" },
  { id: "femme", label: "Femme", emoji: "👩" },
];

/** Modificateurs Fitzpatrick (teinte de peau). */
export const SKIN_TONES: Array<{ id: string; label: string; modifier: string }> = [
  { id: "clair", label: "Clair", modifier: "\u{1F3FB}" },
  { id: "moyen-clair", label: "Moyen clair", modifier: "\u{1F3FC}" },
  { id: "moyen", label: "Moyen", modifier: "\u{1F3FD}" },
  { id: "mat", label: "Mat", modifier: "\u{1F3FE}" },
  { id: "fonce", label: "Foncé", modifier: "\u{1F3FF}" },
];

/** Visages/personnes de base, déclinés selon le sexe choisi. */
export const AVATAR_BASES: Record<import("./types").Gender, string[]> = {
  homme: ["👨", "👦", "🧔", "👴", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🎨", "👨‍💻", "👨‍🏭"],
  femme: ["👩", "👧", "👵", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👩‍🎨", "👩‍💻", "👩‍🏭", "💁‍♀️"],
  autre: ["🧑", "🧒", "🧓", "🧑‍🦰", "🧑‍🦱", "🧑‍🦳", "🧑‍🎨", "🧑‍💻", "🧑‍🏭", "🙋"],
  "non-precise": ["🧑", "🧒", "🧓", "🧑‍🦰", "🧑‍🦱", "🧑‍🦳", "🧑‍🎨", "🧑‍💻", "🧑‍🏭", "🙋"],
};

/** Applique un modificateur de teinte juste après le premier point de code. */
export function withSkinTone(base: string, modifier: string) {
  const points = [...base];
  if (!points.length) return base;
  return points[0]! + modifier + points.slice(1).join("");
}

export const AVATARS = AVATAR_BASES["non-precise"];

export const DEFAULT_PROFILE: ArcadeProfile = {
  nickname: "Joueur STAF",
  gender: "non-precise",
  avatar: "🧑",
  skinTone: "moyen",
  city: "Porto-Novo",
  onboarded: false,
  termsAcceptedAt: null,
  totalXP: 0,
  level: 1,
  unlockedTitle: LEVELS[0]!.title,
  unlockedBadges: [],
  gamesData: {
    printingMaster: { highScore: 0, levelsCompleted: 0 },
    studioManager: { maxReputation: 0, totalRevenue: 0, bestRunDays: 0 },
    webQuest: { completedChapters: [], bestTimeSeconds: 0 },
    skillArcade: { minigamesPlayed: 0, bestStreak: 0 },
    webBuilder: { bestScore: 0, played: 0 },
    visualCreator: { bestScore: 0, played: 0 },
    errorHunt: { bestScore: 0, played: 0 },
    pixelArt: { bestScore: 0, played: 0 },
    logoSteps: { bestScore: 0, played: 0 },
    backEraser: { bestScore: 0, played: 0 },
  },
  history: [],
};

export function formatFCFA(value: number) {
  return `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
}