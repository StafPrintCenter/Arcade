import { motion } from "framer-motion";
import { Pencil, ShieldCheck } from "lucide-react";
import { ShareProgress } from "@/components/arcade/share-progress";
import { GENDERS } from "@/lib/arcade/data";
import type { useArcadeProfile } from "@/hooks/useArcadeProfile";

interface UserProfileCardProps {
  profile: ReturnType<typeof useArcadeProfile>["profile"];
  hydrated: boolean;
  level: number;
  title: string;
  progress: number;
  next: ReturnType<typeof useArcadeProfile>["next"];
  onEditProfile: () => void;
}

export function UserProfileCard({
  profile,
  hydrated,
  level,
  title,
  progress,
  next,
  onEditProfile,
}: UserProfileCardProps) {
  const genderLabel = GENDERS.find((g) => g.id === profile.gender)?.label ?? "";

  return (
    <section className="card-arcade p-6">
      <div className="flex flex-wrap items-center gap-5">
        <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-3xl">
          {profile.avatar}
        </span>
        <div className="min-w-55 flex-1">
          <button
            type="button"
            className="flex items-center gap-2 font-display text-2xl hover:text-primary cursor-pointer"
            onClick={onEditProfile}
          >
            {hydrated ? profile.nickname : "…"}
            <Pencil className="size-4 text-primary" />
          </button>
          <p className="mt-1 text-sm text-muted-foreground">
            Niveau {level} : <span className="text-primary">{title}</span>
            {genderLabel && profile.gender !== "non-precise" ? ` • ${genderLabel}` : ""}
          </p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-xp)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {profile.totalXP} XP{next ? ` • ${next.xp - profile.totalXP} XP avant « ${next.title} »` : " • rang maximum atteint"}
          </p>
        </div>
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