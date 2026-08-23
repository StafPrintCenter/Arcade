import { useEffect, useState } from "react";
import { Panel, Stat, type GameProps } from "@/components/arcade/game-kit";
import { Button } from "@/components/ui/button";
import { sample, shuffle } from "@/lib/arcade/random";
import { cn } from "@/lib/utils";

interface Brief {
  name: string;
  desc: string;
  steps: string[];
  traps: string[];
}

const BRIEFS: Brief[] = [
  {
    name: "AKPAKO Coffee",
    desc: "Monogramme « A » en grain de café, bicolore brun/crème, à décliner en tampon.",
    steps: [
      "Analyser le brief et la concurrence",
      "Croquis papier de plusieurs pistes",
      "Vectoriser la piste retenue à la plume",
      "Construire sur une grille et ajuster les courbes",
      "Décliner en monochrome et tester en petit format",
      "Exporter SVG, PDF vectoriel et PNG transparent",
    ],
    traps: ["Appliquer un dégradé arc-en-ciel", "Partir d'une image JPG floue"],
  },
  {
    name: "LAGUNE Immo",
    desc: "Logotype avec pictogramme de vague et toit, bleu profond, usage panneaux + web.",
    steps: [
      "Cadrer le positionnement de la marque",
      "Recherche de formes simples vague + toit",
      "Tracer le pictogramme en vectoriel",
      "Associer le typogramme et régler l'approche",
      "Vérifier la lisibilité à 16 px et à 3 m",
      "Livrer la charte : couleurs, marges, interdits",
    ],
    traps: ["Ajouter une ombre portée bitmap", "Choisir une police script fine"],
  },
  {
    name: "OUIDAH Fitness",
    desc: "Emblème dynamique haltère + soleil, orange/anthracite, usage textile et enseigne.",
    steps: [
      "Définir la cible et le ton de la marque",
      "Moodboard et références sportives",
      "Croquis rapides de l'emblème",
      "Vectorisation et simplification des formes",
      "Test en broderie et en petite taille",
      "Livraison des fichiers vectoriels et guide d'usage",
    ],
    traps: ["Copier un logo de marque connue", "Utiliser 6 couleurs différentes"],
  },
  {
    name: "ZINSOU Pharma",
    desc: "Croix stylisée en feuille, vert médical, lisible sur enseigne lumineuse.",
    steps: [
      "Analyser les contraintes réglementaires",
      "Explorer croix + feuille en croquis",
      "Construire la forme sur grille modulaire",
      "Choisir une typographie humaniste lisible",
      "Vérifier le rendu en rétroéclairage",
      "Exporter les déclinaisons et la charte",
    ],
    traps: ["Ajouter un effet 3D biseauté", "Composer directement en pixels 72 dpi"],
  },
];


export function LogoSteps({ setScore, setStatus, onFinish }: GameProps) {
  const [briefs] = useState(() => sample(BRIEFS, 2));
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const brief = briefs[round]!;

  useEffect(() => {
    setPool(shuffle([...brief.steps, ...brief.traps]));
    setOrder([]);
  }, [brief]);

  useEffect(() => setStatus(`Logo ${round + 1}/${briefs.length} — ${brief.name}`), [brief.name, round, setStatus]);

  function validate() {
    let gained = 0;
    order.forEach((s, i) => {
      if (brief.traps.includes(s)) gained -= 10;
      else if (brief.steps[i] === s) gained += 20;
      else gained += 5;
    });
    const total = Math.max(0, points + gained);
    setPoints(total);
    setScore(total);
    if (round + 1 < briefs.length) {
      setRound(round + 1);
      return;
    }
    const max = briefs.length * 6 * 20;
    onFinish({
      score: total,
      xp: Math.round(total * 0.8),
      label: `Process de création validé : ${total}/${max}`,
      victory: total >= max * 0.7,
      patch: { logoSteps: { bestScore: total, played: 1 } },
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr_200px]">
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Brief fictif</p>
        <h2 className="mt-1 font-display text-2xl">{brief.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{brief.desc}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">Étapes disponibles</p>
        <div className="mt-2 space-y-2">
          {pool.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setOrder([...order, s]);
                setPool(pool.filter((p) => p !== s));
              }}
              className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-left text-sm hover:border-primary/60"
            >
              {s}
            </button>
          ))}
          {pool.length === 0 ? <p className="text-xs text-muted-foreground">Toutes les cartes sont placées.</p> : null}
        </div>
      </Panel>
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Votre process (dans l'ordre)</p>
        <div className="mt-3 space-y-2">
          {order.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setOrder(order.filter((o) => o !== s));
                setPool([...pool, s]);
              }}
              className={cn("flex w-full items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-left text-sm")}
            >
              <span className="font-display text-primary">{i + 1}</span>
              {s}
            </button>
          ))}
          {order.length === 0 ? <p className="text-xs text-muted-foreground">Cliquez les étapes à gauche pour construire votre méthode.</p> : null}
        </div>
        <Button className="mt-5 w-full" disabled={order.length < 4} onClick={validate}>
          {round + 1 < briefs.length ? "Valider et logo suivant" : "Terminer"}
        </Button>
      </Panel>
      <div className="space-y-3">
        <Stat label="Points" value={`${points}`} tone="primary" />
        <Panel className="p-4 text-xs text-muted-foreground">
          Attention : deux cartes sont des pièges. Ne les placez pas.
        </Panel>
      </div>
    </div>
  );
}
