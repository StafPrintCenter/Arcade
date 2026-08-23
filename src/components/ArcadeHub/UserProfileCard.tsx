import { motion } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";
import { ShareProgress } from "@/components/arcade/share-progress";
import type { useArcadeProfile } from "@/hooks/useArcadeProfile";

interface UserProfileCardProps {
  profile: ReturnType<typeof useArcadeProfile>["profile"];
  level: number;
  title: string;
  progress: number;
  next: ReturnType<typeof useArcadeProfile>["next"];
}

export function UserProfileCard({
  profile,
  level,
  title,
  progress,
  next,
}: UserProfileCardProps) {
  return (
    <section className="card-arcade p-6">
      <div className="flex flex-wrap items-center gap-5">
        {/* Icône de Progression / Niveau */}
        <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary neon-glow">
          <Zap className="size-8" />
        </span>

        {/* Détails du Niveau et de l'XP */}
        <div className="min-w-55 flex-1">
          <div className="flex items-center gap-2 font-display text-2xl">
            Niveau {level} : <span className="text-primary">{title}</span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-xp)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {profile.totalXP} XP
            {next
              ? ` • ${next.xp - profile.totalXP} XP avant « ${next.title} »`
              : " • Rang maximum atteint !"}
          </p>
        </div>

        {/* Badges et Sessions */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
            <p className="font-display text-2xl text-primary">{profile.unlockedBadges.length}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Badges</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
            <p className="font-display text-2xl text-rare">{profile.history.length}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sessions</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Données non collectées • scores visibles par vous seul
        </p>
        <ShareProgress
          compact
          message={`Je suis ${title} (niveau ${level}) avec ${profile.totalXP} XP sur SPC Arcade !`}
        />
      </div>
    </section>
  );
}