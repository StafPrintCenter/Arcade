import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Gauge, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArcadeProfile } from "@/hooks/useArcadeProfile";
import { BADGES, GAMES } from "@/lib/arcade/data";
import type { GameId, GameResult } from "@/lib/arcade/types";
import { ShareProgress, type GameProps } from "@/components/arcade";
import { ArcadeShell } from "@/components/site/ArcadeShell";
import {
  PrintingMaster,
  StudioManager,
  WebQuest,
  SkillArcade,
  WebBuilder,
  VisualCreator,
  ErrorHunt,
  PixelArt,
  LogoSteps,
  BackEraser,
} from "@/components/arcade/games";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/play/$gameId")({
  head: () => ({
    meta: [
      { title: "Partie en cours | SPC Arcade" },
      { name: "description", content: "Session de jeu SPC Arcade : score, chronomètre et XP en temps réel." },
      { property: "og:title", content: "Partie en cours - SPC Arcade" },
      { property: "og:description", content: `Jouez et gagnez de l'XP dans le hub de jeux ${SITE.name}.` },
    ],
  }),
  component: PlayPage,
});

const COMPONENTS: Record<GameId, ComponentType<GameProps>> = {
  printingMaster: PrintingMaster,
  studioManager: StudioManager,
  webQuest: WebQuest,
  skillArcade: SkillArcade,
  webBuilder: WebBuilder,
  visualCreator: VisualCreator,
  errorHunt: ErrorHunt,
  pixelArt: PixelArt,
  logoSteps: LogoSteps,
  backEraser: BackEraser,
};

function PlayPage() {
  const { gameId } = Route.useParams();
  const navigate = useNavigate();
  const { profile, hydrated, submitResult } = useArcadeProfile();
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Session en cours");
  const [result, setResult] = useState<GameResult | null>(null);
  const [freshBadges, setFreshBadges] = useState<string[]>([]);
  const [runKey, setRunKey] = useState(0);

  const game = GAMES.find((g) => g.id === gameId);
  const Game = game ? COMPONENTS[game.id as GameId] : null;

  useEffect(() => {
    if (!result) return;
    if (result.victory || result.newRecord || freshBadges.length > 0) {
      confetti({ particleCount: 140, spread: 75, origin: { y: 0.7 }, colors: ["#f97316", "#ea580c", "#22c55e", "#a855f7"] });
    }
  }, [result, freshBadges]);

  if (!game || !Game) {
    return (
      <ArcadeShell>
        <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-12">
          {/* Décor de fond */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:32px_32px]" />

            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-x-0 h-px bg-primary/20"
            />
          </div>

          {/* Console centrale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl"
          >
            <div className="card-arcade overflow-hidden border-primary/20 neon-glow">
              {/* Barre de terminal */}
              <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-destructive/70" />
                  <span className="size-2.5 rounded-full bg-yellow-500/70" />
                  <span className="size-2.5 rounded-full bg-success/70" />
                </div>

                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  SPC // ARCADE SYSTEM
                </span>

                <span className="font-mono text-[10px] text-muted-foreground">
                  ERR_404
                </span>
              </div>

              {/* Contenu */}
              <div className="px-6 py-10 text-center sm:px-10">
                {/* Icône / zone perdue */}
                <motion.div
                  animate={{
                    rotate: [0, -3, 3, -2, 0],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mx-auto mb-6 flex size-24 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_40px_hsl(var(--primary)/0.15)]"
                >
                  <div className="relative font-display text-4xl font-black text-primary">
                    ?
                    <span className="absolute -right-3 -top-1 text-xs text-primary/60">
                      ×
                    </span>
                  </div>
                </motion.div>

                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  Zone inconnue
                </p>

                <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">
                  GAME NOT FOUND
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                  Cette partie n'existe pas, a été déplacée ou s'est
                  probablement échappée du système.
                </p>

                {/* Faux terminal */}
                <div className="mt-7 rounded-xl border border-border bg-background/70 p-4 text-left font-mono text-xs">
                  <div className="flex gap-2">
                    <span className="text-success">&gt;</span>
                    <span className="text-muted-foreground">
                      searching_game_id...
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <span className="text-success">&gt;</span>
                    <span className="text-muted-foreground">
                      scanning_arcade_sector...
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <span className="text-destructive">✕</span>
                    <span className="text-destructive">
                      GAME_ID_NOT_FOUND
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <span className="text-primary">&gt;</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                      className="text-primary"
                    >
                      _
                    </motion.span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button asChild className="sm:min-w-44">
                    <Link to="/">Retour au Hub</Link>
                  </Button>

                  <Button
                    variant="secondary"
                    asChild
                    className="sm:min-w-44"
                  >
                    <Link to="/">
                      Explorer les jeux
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Footer console */}
              <div className="border-t border-border bg-secondary/20 px-4 py-2">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  <span>Connection: LOST</span>
                  <span>Sector: 404</span>
                  <span>Player: ONLINE</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
              Some levels are better left undiscovered.
            </p>
          </motion.div>
        </div>
      </ArcadeShell>
    );
  }

  function handleFinish(r: GameResult) {
    const unlocked = submitResult(game!.id, r);
    setFreshBadges(unlocked);
    setResult(r);
  }

  function replay() {
    setResult(null);
    setFreshBadges([]);
    setScore(0);
    setRunKey((k) => k + 1);
  }

  const customHeaderContent = (
    <div className="flex flex-1 items-center justify-between gap-2 min-w-0 ml-2 sm:ml-6">
      {/* Bouton de retour + Titre du jeu */}
      <div className="flex items-center gap-2 min-w-0">
        <Button variant="ghost" size="icon" className="size-8 shrink-0" asChild>
          <Link to="/" aria-label="Retour au hub">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <span className="font-display text-sm sm:text-base font-semibold truncate">
          {game.name}
        </span>
      </div>

      {/* Score & Statut */}
      <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm">
        <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-primary font-semibold">
          <Gauge className="size-3.5" />
          <span>{score} <span className="hidden xs:inline">pts</span></span>
        </div>
        <span className="hidden md:inline-block text-muted-foreground text-xs max-w-30 truncate">
          {status}
        </span>
      </div>
    </div>
  );

  return (
    <ArcadeShell headerContent={customHeaderContent}>
      {hydrated ? (
        <Game
          key={runKey}
          profile={profile}
          setScore={setScore}
          setStatus={setStatus}
          onFinish={handleFinish}
        />
      ) : (
        <p className="text-center text-sm text-muted-foreground">Chargement de votre profil…</p>
      )}

      <AnimatePresence>
        {result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="card-arcade w-full max-w-md p-7 text-center neon-glow"
            >
              <h2 className="font-display text-3xl">
                {result.victory ? "Mission accomplie !" : "Partie terminée"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{result.label}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="font-display text-2xl text-primary">{result.score}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Score</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="font-display text-2xl text-success">+{Math.round(result.xp)}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">XP gagnée</p>
                </div>
              </div>

              {result.newRecord ? (
                <p className="mt-4 text-sm text-primary">Nouveau record personnel !</p>
              ) : null}

              {freshBadges.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {freshBadges.map((id) => {
                    const b = BADGES.find((x) => x.id === id);
                    return (
                      <p key={id} className="flex items-center justify-center gap-2 rounded-xl border border-rare/50 bg-rare/10 p-2 text-sm text-rare">
                        <Trophy className="size-4" /> Badge débloqué : {b?.name}
                      </p>
                    );
                  })}
                </div>
              ) : null}

              <div className="mt-5 flex justify-center">
                <ShareProgress
                  compact
                  message={`J'ai marqué ${result.score} pts (+${Math.round(result.xp)} XP) sur ${game.name}`}
                />
              </div>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1" onClick={replay}>
                  Rejouer
                </Button>
                <Button variant="secondary" className="flex-1" asChild>
                  <Link to="/">Retour au Hub</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ArcadeShell>
  );
}