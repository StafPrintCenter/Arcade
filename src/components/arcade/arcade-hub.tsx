import { useState } from "react";
import { Pencil, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArcadeShell } from "@/components/site/ArcadeShell";
import { ProfileSetup, TermsBanner } from "@/components/arcade/onboarding";
import {
  UserProfileCard,
  GameCatalog,
  BadgesGrid,
  LocalLeaderboard,
} from "@/components/ArcadeHub";
import { useArcadeProfile } from "@/hooks/useArcadeProfile";
import { ThemeToggle } from "@/components/arcade/theme-toggle";
import { GENDERS } from "@/lib/arcade/data";

export function ArcadeHub() {
  const { profile, hydrated, updateProfile, resetProfile, level, title, progress, next } = useArcadeProfile();
  const [editing, setEditing] = useState(false);

  const showTerms = hydrated && !profile.termsAcceptedAt;
  const showSetup = hydrated && !showTerms && (!profile.onboarded || editing);
  const genderLabel = GENDERS.find((g) => g.id === profile.gender)?.label ?? "";

  return (
    <ArcadeShell>
      {showTerms ? (
        <TermsBanner onAccept={() => updateProfile({ termsAcceptedAt: new Date().toISOString() })} />
      ) : null}

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

      {/* Hero Header avec informations du Joueur */}
      <header className="flex flex-col gap-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Profil Joueur (Avatar, Pseudo, Sexe, Ville) */}
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-3xl">
              {profile.avatar}
            </span>
            <div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex font-black items-center gap-2 font-display text-2xl sm:text-3xl hover:text-primary transition-colors cursor-pointer"
              >
                <span className="text-gradient-arcade">{hydrated ? profile.nickname : "…"}</span>
                <Pencil className="size-4 text-primary" />
              </button>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {hydrated ? profile.city : "Porto-Novo"}
                {genderLabel && profile.gender !== "non-precise" ? ` • ${genderLabel}` : ""}
              </p>
            </div>
          </div>

          {/* Actions Profil */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 size-4" /> Modifier profil
            </Button>
            <Button variant="ghost" size="sm" onClick={resetProfile}>
              <RotateCcw className="mr-1 size-4" /> Réinitialiser
            </Button>
          </div>
        </div>

        {/* Carte Progression & Statistiques */}
        <UserProfileCard
          profile={profile}
          level={level}
          title={title}
          progress={progress}
          next={next}
        />
      </header>

      {/* Catalogue */}
      <GameCatalog gamesData={profile.gamesData} />

      {/* Badges & Classement */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <BadgesGrid unlockedBadges={profile.unlockedBadges} />
        <LocalLeaderboard history={profile.history} currentLevel={level} />
      </section>
    </ArcadeShell>
  );
}
