import { Sparkles } from "lucide-react";
import { GameCard } from "./GameCard";
import { GAMES } from "@/lib/arcade/data";
import type { useArcadeProfile } from "@/hooks/useArcadeProfile";

interface GameCatalogProps {
  gamesData: ReturnType<typeof useArcadeProfile>["profile"]["gamesData"];
}

export function GameCatalog({ gamesData }: GameCatalogProps) {
  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 font-display text-2xl">
        <Sparkles className="size-5 text-primary" /> Catalogue des jeux
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} gamesData={gamesData} />
        ))}
      </div>
    </section>
  );
}