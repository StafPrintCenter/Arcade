import { History } from "lucide-react";
import { GAMES, LEVELS } from "@/lib/arcade/data";
import type { useArcadeProfile } from "@/hooks/useArcadeProfile";

interface LocalLeaderboardProps {
  history: ReturnType<typeof useArcadeProfile>["profile"]["history"];
  currentLevel: number;
}

export function LocalLeaderboard({ history, currentLevel }: LocalLeaderboardProps) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-2xl">
        <History className="size-5 text-primary" /> Classement local
      </h2>
      <div className="card-arcade mt-5 divide-y divide-border p-2">
        {history.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Aucune session enregistrée. Lancez un jeu pour ouvrir votre palmarès.
          </p>
        ) : null}
        {[...history]
          .sort((a, b) => b.xpEarned - a.xpEarned)
          .slice(0, 8)
          .map((h, i) => (
            <div key={`${h.timestamp}-${i}`} className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-sm">{GAMES.find((g) => g.id === h.gameId)?.name ?? h.gameId}</p>
                <p className="text-xs text-muted-foreground">
                  {h.label ?? ""} • {new Date(h.timestamp).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <span className="font-display text-primary">+{h.xpEarned} XP</span>
            </div>
          ))}
      </div>
      <div className="card-arcade mt-4 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Grades STAF</p>
        <div className="mt-2 space-y-1 text-sm">
          {LEVELS.map((l) => (
            <p key={l.level} className={l.level === currentLevel ? "text-primary font-semibold" : "text-muted-foreground"}>
              Niveau {l.level} - {l.title} <span className="text-xs">({l.xp} XP)</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}