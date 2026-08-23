import { createFileRoute } from "@tanstack/react-router";
import { ArcadeHub } from "@/components/arcade/arcade-hub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPC Arcade - Jeux & gamification STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Jouez aux 4 jeux du studio STAF PRINT CENTER : prépresse, gestion d'agence créative, escape game print & web et micro-défis arcade.",
      },
      { property: "og:title", content: "SPC Arcade - Jeux & gamification STAF PRINT CENTER" },
      {
        property: "og:description",
        content: "Gagnez de l'XP, montez en grade et débloquez les badges du studio de Porto-Novo.",
      },
    ],
  }),
  component: ArcadeHub,
});
