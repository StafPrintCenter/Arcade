import { createFileRoute } from "@tanstack/react-router";
import { ArcadeHub } from "@/components/arcade/arcade-hub";

export const Route = createFileRoute("/arcade/")({
  head: () => ({
    meta: [
      { title: "SPC Arcade - Hub de jeux STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Le hub de jeux et de gamification de STAF PRINT CENTER : prépresse, gestion d'agence, escape game et micro-défis créatifs.",
      },
      { property: "og:title", content: "SPC Arcade - Hub de jeux STAF PRINT CENTER" },
      {
        property: "og:description",
        content: "Gagnez de l'XP, débloquez des badges et devenez Légende STAF dans les 4 jeux du studio.",
      },
    ],
  }),
  component: ArcadeHub,
});