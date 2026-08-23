import { useState } from "react";
import { Gamepad2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, PageFooter } from "@/components/site";
import { ProfileSetup, TermsBanner } from "@/components/arcade/onboarding";
import {
  UserProfileCard,
  GameCatalog,
  BadgesGrid,
  LocalLeaderboard,
} from "@/components/ArcadeHub";
import { useArcadeProfile } from "@/hooks/useArcadeProfile";

export function ArcadeHub() {
  const { profile, hydrated, updateProfile, resetProfile, level, title, progress, next } = useArcadeProfile();
  const [editing, setEditing] = useState(false);

  const showTerms = hydrated && !profile.termsAcceptedAt;
  const showSetup = hydrated && !showTerms && (!profile.onboarded || editing);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
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

        {/* Hero Header */}
        <header className="flex flex-col gap-8 mb-8">
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

          <UserProfileCard
            profile={profile}
            hydrated={hydrated}
            level={level}
            title={title}
            progress={progress}
            next={next}
            onEditProfile={() => setEditing(true)}
          />
        </header>

        {/* Catalogue */}
        <GameCatalog gamesData={profile.gamesData} />

        {/* Badges & Classement */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <BadgesGrid unlockedBadges={profile.unlockedBadges} />
          <LocalLeaderboard history={profile.history} currentLevel={level} />
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
