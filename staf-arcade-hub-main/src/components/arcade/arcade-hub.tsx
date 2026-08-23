import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Eraser,
  Gamepad2,
  Grid3x3,
  History,
  LayoutTemplate,
  Lock,
  Palette,
  Pencil,
  Printer,
  Puzzle,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileSetup, TermsBanner } from "@/components/arcade/onboarding";
import { ShareProgress } from "@/components/arcade/share-progress";
import { useArcadeProfile } from "@/hooks/useArcadeProfile";
import { BADGES, GAMES, GENDERS, LEVELS } from "@/lib/arcade/data";
import type { GameId } from "@/lib/arcade/types";

const ICONS: Record<string, typeof Printer> = {
  printer: Printer,
  building: Building2,
  puzzle: Puzzle,
  target: Target,
  layout: LayoutTemplate,
  palette: Palette,
  search: Search,
  grid: Grid3x3,
  shapes: Shapes,
  eraser: Eraser,
};

function bestScoreLabel(id: GameId, data: ReturnType<typeof useArcadeProfile>["profile"]["gamesData"]) {
  switch (id) {
    case "printingMaster":
      return `Record : ${data.printingMaster.highScore} pts`;
    case "studioManager":
      return `Réputation max : ${data.studioManager.maxReputation}/100`;
    case "webQuest":
      return data.webQuest.bestTimeSeconds
        ? `Meilleur temps : ${Math.floor(data.webQuest.bestTimeSeconds / 60)} min ${data.webQuest.bestTimeSeconds % 60}s`
        : "Jamais terminé";
    case "skillArcade":
      return `Meilleure série : ${data.skillArcade.bestStreak}`;
    default: {
      const d = data[id];
      return d && "bestScore" in d ? `Record : ${d.bestScore} pts` : "Jamais joué";
    }
  }
}

export function ArcadeHub() {
  const { profile, hydrated, updateProfile, resetProfile, level, title, progress, next } = useArcadeProfile();
  const [editing, setEditing] = useState(false);

  const showTerms = hydrated && !profile.termsAcceptedAt;
  const showSetup = hydrated && !showTerms && (!profile.onboarded || editing);
  const genderLabel = GENDERS.find((g) => g.id === profile.gender)?.label ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      {showTerms ? <TermsBanner onAccept={() => updateProfile({ termsAcceptedAt: new Date().toISOString() })} /> : null}
      {showSetup ? (
        <ProfileSetup
          profile={profile}
          onSave={(patch) => {
            updateProfile(patch);
            setEditing(false);
          }}
          {...(profile.onboarded ? { onCancel: () => setEditing(false) } : {})}
        />
      ) : null}

      <header className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary neon-glow">
              <Gamepad2 className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl leading-none tracking-tight sm:text-4xl">
                <span className="text-gradient-arcade">SPC Arcade</span>
              </h1>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Staf Print Center • {hydrated ? profile.city : "Porto-Novo"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 size-4" /> Mon profil
            </Button>
            <Button variant="ghost" size="sm" onClick={resetProfile}>
              Réinitialiser
            </Button>
          </div>
        </div>

        <section className="card-arcade p-6">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-3xl">
              {profile.avatar}
            </span>
            <div className="min-w-[220px] flex-1">
              <button
                type="button"
                className="flex items-center gap-2 font-display text-2xl hover:text-primary"
                onClick={() => setEditing(true)}
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
      </header>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <Sparkles className="size-5 text-primary" /> Catalogue des jeux
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {GAMES.map((g, i) => {
            const Icon = ICONS[g.icon] ?? Gamepad2;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="card-arcade group flex flex-col p-6 transition-shadow hover:neon-glow"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {g.difficulty}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl">{g.name}</h3>
                <p className="text-xs uppercase tracking-[0.16em] text-primary/80">{g.category}</p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.tagline}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{bestScoreLabel(g.id, profile.gamesData)}</span>
                  <Button asChild size="sm">
                    <Link to="/arcade/play/$gameId" params={{ gameId: g.id }}>
                      Jouer
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl">
            <Award className="size-5 text-primary" /> Badges & trophées
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {BADGES.map((b) => {
              const unlocked = profile.unlockedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`flex items-start gap-3 rounded-2xl border p-4 ${
                    unlocked ? "border-primary/50 bg-primary/10" : "border-border bg-secondary/30 opacity-70"
                  }`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                      unlocked ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {unlocked ? <Trophy className="size-4" /> : <Lock className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                    <p
                      className={`mt-1 text-[10px] uppercase tracking-[0.14em] ${
                        b.rarity === "legendaire" ? "text-rare" : b.rarity === "rare" ? "text-success" : "text-muted-foreground"
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

        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl">
            <History className="size-5 text-primary" /> Classement local
          </h2>
          <div className="card-arcade mt-5 divide-y divide-border p-2">
            {profile.history.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Aucune session enregistrée. Lancez un jeu pour ouvrir votre palmarès.
              </p>
            ) : null}
            {[...profile.history]
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
                <p key={l.level} className={l.level === level ? "text-primary" : "text-muted-foreground"}>
                  Niveau {l.level} — {l.title} <span className="text-xs">({l.xp} XP)</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
