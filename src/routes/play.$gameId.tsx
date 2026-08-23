import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Gauge, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArcadeProfile } from "@/hooks/useArcadeProfile";
import { BADGES, GAMES } from "@/lib/arcade/data";
import type { GameId, GameResult } from "@/lib/arcade/types";
import type { GameProps } from "@/components/arcade/game-kit";
import { ShareProgress } from "@/components/arcade/share-progress";
import { PageFooter } from "@/components/site";
import logo from "@/assets/logos.json";
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

export const Route = createFileRoute("/play/$gameId")({
  head: () => ({
    meta: [
      { title: "Partie en cours | SPC Arcade" },
      { name: "description", content: "Session de jeu SPC Arcade : score, chronomètre et XP en temps réel." },
      { property: "og:title", content: "Partie en cours - SPC Arcade" },
      { property: "og:description", content: "Jouez et gagnez de l'XP dans le hub de jeux STAF PRINT CENTER." },
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl">Jeu introuvable</h1>
        <Button asChild>
          <Link to="/">Retour au hub</Link>
        </Button>
      </div>
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

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <img src={logo.dc} alt="Logo SPC" className="h-10 md:h-12 w-auto" />
          </Link>

          <p className="font-display text-lg">{game.name}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-primary">
              <Gauge className="size-4" /> {score} pts
            </span>
            <span className="text-muted-foreground">{status}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {hydrated ? (
          <Game
            key={runKey}
            profile={profile}
            setScore={setScore}
            setStatus={setStatus}
            onFinish={handleFinish}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Chargement de votre profil…</p>
        )}
      </main>

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

      <PageFooter />
    </div>
  );
}