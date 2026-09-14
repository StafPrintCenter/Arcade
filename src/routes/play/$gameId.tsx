import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Gamepad2, Gauge, Ghost, Home, Sparkles, Trophy } from "lucide-react";
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
    const featuredGames = GAMES.slice(0, 3);

    return (
      <ArcadeShell>
        <div className="relative flex min-h-[75vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
          {/* Grille d'arrière-plan avec lueur néon */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-size-[2rem_2rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 mx-auto max-w-xl"
          >
            {/* Badge Glitch Arcade */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest backdrop-blur-md mb-6">
              <Ghost className="size-3.5" />
              <span>ERROR 404 // ZONE INEXPLORÉE</span>
            </div>

            {/* Illustration Rétro */}
            <div className="relative mx-auto mb-6 flex size-28 items-center justify-center rounded-3xl border border-border bg-card/50 p-4 shadow-2xl backdrop-blur-xl">
              <Gamepad2 className="size-16 text-muted-foreground/40" />
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg"
              >
                <Sparkles className="size-5" />
              </motion.div>
            </div>

            {/* Message principal */}
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Niveau introuvable
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Ce mini-jeu n'existe pas ou a été déplacé dans une autre dimension. Choisissez un autre défi à relever !
            </p>

            {/* Actions principales */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-primary/25" asChild>
                <Link to="/">
                  <Home className="size-4" />
                  Retour au Hub Arcade
                </Link>
              </Button>
            </div>

            {/* Suggestions de jeux */}
            {featuredGames.length > 0 && (
              <div className="mt-12 border-t border-border/60 pt-8">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                  Essayez l'un de ces défis :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {featuredGames.map((g) => (
                    <Link
                      key={g.id}
                      to="/play/$gameId"
                      params={{ gameId: g.id }}
                      className="group flex flex-col items-center rounded-xl border border-border/80 bg-card/40 p-3 transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-md"
                    >
                      <span className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {g.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {g.tagline}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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