import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Eraser, Gamepad2, Grid3x3, LayoutTemplate, Palette, Printer, Puzzle, Search, Shapes, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { useArcadeProfile } from "@/hooks/useArcadeProfile";
import type { Game, GameId } from "@/lib/arcade/types";

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

function getBestScoreLabel(id: GameId, data: ReturnType<typeof useArcadeProfile>["profile"]["gamesData"]) {
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

interface GameCardProps {
  game: Game;
  index: number;
  gamesData: ReturnType<typeof useArcadeProfile>["profile"]["gamesData"];
}

export function GameCard({ game, index, gamesData }: GameCardProps) {
  const Icon = ICONS[game.icon] ?? Gamepad2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="card-arcade group flex flex-col p-6 transition-shadow hover:neon-glow"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {game.difficulty}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl">{game.name}</h3>
      <p className="text-xs uppercase tracking-[0.16em] text-primary/80">{game.category}</p>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{game.tagline}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{getBestScoreLabel(game.id, gamesData)}</span>
        <Button asChild size="sm">
          <Link to="/play/$gameId" params={{ gameId: game.id }}>
            Jouer
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}