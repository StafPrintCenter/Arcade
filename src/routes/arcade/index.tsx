import { createFileRoute } from "@tanstack/react-router";
import { ArcadeHub } from "@/components/arcade/arcade-hub";
import { SITE } from "@/data/site";

const ARCADE_TITLE = `SPC Arcade - Jeux & gamification ${SITE.name}`;
const ARCADE_DESC = `Jouez aux 4 jeux du studio STAF PRINT CENTER : prépresse, gestion d'agence créative, escape game print & web et micro-défis arcade.`;

export const Route = createFileRoute("/arcade/")({
  head: () => ({
    meta: [
      { title: ARCADE_TITLE },
      { name: "description", content: ARCADE_DESC },
      { property: "og:title", ARCADE_TITLE },
      { property: "og:description", content: ARCADE_DESC },
    ],
  }),
  component: ArcadeHub,
});