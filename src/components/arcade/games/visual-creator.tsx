import { useEffect, useState } from "react";
import { Panel, Stat, type GameProps } from "@/components/arcade/game-kit";
import { Button } from "@/components/ui/button";
import { pick as pickOne, shuffle } from "@/lib/arcade/random";
import { cn } from "@/lib/utils";

const BRIEFS = [
  { text: "Affiche promo : « -20% sur toutes les impressions grand format ».", head: "-20%", tail: "grand format" },
  { text: "Post réseaux : « Cartes de visite livrées en 24h ».", head: "24h", tail: "cartes de visite" },
  { text: "Affiche événement : « Salon du Print - Porto-Novo, 12 mai ».", head: "12 mai", tail: "Salon du Print" },
  { text: "Flyer promo : « Roll-up 85x200 à prix atelier ».", head: "Roll-up", tail: "prix atelier" },
];

const OPTIONS = {
  format: [
    { id: "a3", label: "A3 portrait (affiche)", good: true },
    { id: "carre", label: "Carré 1:1 (réseaux)", good: true },
    { id: "banniere", label: "Bannière 3:1 étroite", good: false },
  ],
  fond: [
    { id: "sombre", label: "Fond slate profond", good: true },
    { id: "photo", label: "Photo chargée plein cadre", good: false },
    { id: "blanc", label: "Blanc pur", good: true },
  ],
  titre: [
    { id: "gros", label: "Titre très gros, message court", good: true },
    { id: "moyen", label: "Titre moyen + paragraphe", good: false },
    { id: "petit", label: "Tout au même corps", good: false },
  ],
  accent: [
    { id: "orange", label: "Orange STAF en accent unique", good: true },
    { id: "arcenciel", label: "5 couleurs vives", good: false },
    { id: "gris", label: "Gris sur gris", good: false },
  ],
  logo: [
    { id: "bas", label: "Logo en bas, marge respirée", good: true },
    { id: "centre", label: "Logo au centre par-dessus le titre", good: false },
    { id: "bord", label: "Logo collé au bord", good: false },
  ],
} as const;

type Key = keyof typeof OPTIONS;
const KEYS = Object.keys(OPTIONS) as Key[];
const LABELS: Record<Key, string> = {
  format: "Format",
  fond: "Fond",
  titre: "Hiérarchie du texte",
  accent: "Couleur d'accent",
  logo: "Placement du logo",
};

export function VisualCreator({ setScore, setStatus, onFinish }: GameProps) {
  const [brief] = useState(() => pickOne(BRIEFS));
  const [order] = useState(() => shuffle(KEYS));
  const [picks, setPicks] = useState<Partial<Record<Key, string>>>({});
  const chosen = KEYS.filter((k) => picks[k]).length;

  useEffect(() => setStatus(`${chosen}/${KEYS.length} réglages`), [chosen, setStatus]);

  function pick(k: Key, id: string) {
    const next = { ...picks, [k]: id };
    setPicks(next);
    setScore(
      KEYS.reduce((acc, key) => {
        const opt = OPTIONS[key].find((o) => o.id === next[key]);
        return acc + (opt?.good ? 20 : 0);
      }, 0),
    );
  }

  function deliver() {
    const score = KEYS.reduce((acc, key) => {
      const opt = OPTIONS[key].find((o) => o.id === picks[key]);
      return acc + (opt?.good ? 20 : 0);
    }, 0);
    onFinish({
      score,
      xp: Math.round(score * 1.2),
      label: `Visuel livré : ${score}/100 de pertinence graphique`,
      victory: score >= 80,
      patch: { visualCreator: { bestScore: score, played: 1 } },
    });
  }

  const bg = picks.fond === "blanc" ? "bg-white text-slate-900" : picks.fond === "photo" ? "bg-gradient-to-br from-emerald-700 to-amber-600 text-white" : "bg-slate-900 text-white";
  const accent = picks.accent === "orange" ? "text-orange-500" : picks.accent === "arcenciel" ? "text-fuchsia-500" : "text-slate-500";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Brief</p>
        <p className="mt-1 text-sm text-muted-foreground">{brief.text}</p>
        <div className="mt-5 space-y-5">
          {order.map((k) => (
            <div key={k}>
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">{LABELS[k]}</p>
              <div className="flex flex-wrap gap-2">
                {OPTIONS[k].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => pick(k, o.id)}
                    className={cn(
                      "rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm transition-colors hover:border-primary/60",
                      picks[k] === o.id && "border-primary bg-primary/15",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-6 w-full" disabled={chosen < KEYS.length} onClick={deliver}>
          Livrer le visuel
        </Button>
      </Panel>
      <div className="space-y-3">
        <Stat label="Réglages" value={`${chosen}/${KEYS.length}`} tone="primary" />
        <Panel className="p-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Aperçu</p>
          <div
            className={cn(
              "flex flex-col justify-between rounded-xl p-4",
              bg,
              picks.format === "banniere" ? "aspect-3/1" : picks.format === "carre" ? "aspect-square" : "aspect-3/4",
            )}
          >
            <p className={cn("font-display leading-none", picks.titre === "gros" ? "text-4xl" : picks.titre === "moyen" ? "text-2xl" : "text-base")}>
              {brief.head} <span className={accent}>{brief.tail}</span>
            </p>
            {picks.titre === "moyen" ? <p className="text-[10px] opacity-70">Sur toutes vos impressions grand format ce mois-ci chez STAF PRINT CENTER.</p> : null}
            <p className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", picks.logo === "bord" && "-mb-4 -ml-4", picks.logo === "centre" && "self-center")}>
              STAF PRINT CENTER
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
