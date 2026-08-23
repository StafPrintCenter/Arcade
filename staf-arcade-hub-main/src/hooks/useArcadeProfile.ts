import { useCallback, useEffect, useState } from "react";
import { BADGES, DEFAULT_PROFILE, LEVELS, STORAGE_KEY, levelFromXP } from "@/lib/arcade/data";
import type { ArcadeProfile, GameResult } from "@/lib/arcade/types";

function readProfile(): ArcadeProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<ArcadeProfile>;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      gamesData: { ...DEFAULT_PROFILE.gamesData, ...(parsed.gamesData ?? {}) },
      history: parsed.history ?? [],
      unlockedBadges: parsed.unlockedBadges ?? [],
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function useArcadeProfile() {
  const [profile, setProfile] = useState<ArcadeProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ArcadeProfile) => {
    setProfile(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode */
    }
  }, []);

  const setNickname = useCallback(
    (nickname: string) => persist({ ...profile, nickname: nickname.trim() || "Joueur STAF" }),
    [persist, profile],
  );

  const updateProfile = useCallback(
    (patch: Partial<ArcadeProfile>) => persist({ ...profile, ...patch }),
    [persist, profile],
  );

  const resetProfile = useCallback(() => persist(DEFAULT_PROFILE), [persist]);

  /** Applies a finished game result and returns the newly unlocked badges. */
  const submitResult = useCallback(
    (gameId: keyof ArcadeProfile["gamesData"], result: GameResult) => {
      const totalXP = profile.totalXP + Math.max(0, Math.round(result.xp));
      const lvl = levelFromXP(totalXP);

      const gamesData = { ...profile.gamesData, ...(result.patch ?? {}) } as ArcadeProfile["gamesData"];

      const candidates = new Set(result.badges ?? []);
      if (profile.history.length === 0) candidates.add("first-print");
      if (lvl.level >= LEVELS[LEVELS.length - 1]!.level) candidates.add("legende-staf");

      const fresh = [...candidates].filter(
        (b) => BADGES.some((d) => d.id === b) && !profile.unlockedBadges.includes(b),
      );

      persist({
        ...profile,
        totalXP,
        level: lvl.level,
        unlockedTitle: lvl.title,
        unlockedBadges: [...profile.unlockedBadges, ...fresh],
        gamesData,
        history: [
          { gameId, xpEarned: Math.round(result.xp), timestamp: new Date().toISOString(), label: result.label },
          ...profile.history,
        ].slice(0, 30),
      });

      return fresh;
    },
    [persist, profile],
  );

  return { profile, hydrated, setNickname, updateProfile, resetProfile, submitResult, ...levelFromXP(profile.totalXP) };
}