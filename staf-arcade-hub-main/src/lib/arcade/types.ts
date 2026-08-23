export type GameId =
  | "printingMaster"
  | "studioManager"
  | "webQuest"
  | "skillArcade"
  | "webBuilder"
  | "visualCreator"
  | "errorHunt"
  | "pixelArt"
  | "logoSteps"
  | "backEraser";

export type Gender = "homme" | "femme" | "autre" | "non-precise";

export interface SimpleGameData {
  bestScore: number;
  played: number;
}

export interface ArcadeProfile {
  nickname: string;
  gender: Gender;
  avatar: string;
  city: string;
  onboarded: boolean;
  termsAcceptedAt: string | null;
  totalXP: number;
  level: number;
  unlockedTitle: string;
  unlockedBadges: string[];
  gamesData: {
    printingMaster: { highScore: number; levelsCompleted: number };
    studioManager: { maxReputation: number; totalRevenue: number; bestRunDays: number };
    webQuest: { completedChapters: string[]; bestTimeSeconds: number };
    skillArcade: { minigamesPlayed: number; bestStreak: number };
    webBuilder: SimpleGameData;
    visualCreator: SimpleGameData;
    errorHunt: SimpleGameData;
    pixelArt: SimpleGameData;
    logoSteps: SimpleGameData;
    backEraser: SimpleGameData;
  };
  history: Array<{ gameId: string; xpEarned: number; timestamp: string; label?: string }>;
}

export interface GameResult {
  score: number;
  xp: number;
  label: string;
  victory: boolean;
  newRecord?: boolean;
  patch?: Partial<ArcadeProfile["gamesData"]>;
  badges?: string[];
}
