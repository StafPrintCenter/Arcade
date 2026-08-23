import { Award, Lock, Trophy } from "lucide-react";
import { BADGES } from "@/lib/arcade/data";

interface BadgesGridProps {
  unlockedBadges: string[];
}

export function BadgesGrid({ unlockedBadges }: BadgesGridProps) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-2xl">
        <Award className="size-5 text-primary" /> Badges & trophées
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {BADGES.map((b) => {
          const unlocked = unlockedBadges.includes(b.id);
          return (
            <div
              key={b.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 ${unlocked ? "border-primary/50 bg-primary/10" : "border-border bg-secondary/30 opacity-70"
                }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${unlocked ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
              >
                {unlocked ? <Trophy className="size-4" /> : <Lock className="size-4" />}
              </span>
              <div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
                <p
                  className={`mt-1 text-[10px] uppercase tracking-[0.14em] ${b.rarity === "legendaire" ? "text-rare" : b.rarity === "rare" ? "text-success" : "text-muted-foreground"
                    }`}
                >
                  {b.rarity}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}