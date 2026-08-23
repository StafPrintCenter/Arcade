import { useMemo, useState } from "react";
import { sample, shuffle } from "@/lib/arcade/random";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileWarning } from "lucide-react";
import { ChoiceButton, Panel, Stat, type GameProps } from "../game-kit";
import { Button } from "@/components/ui/button";

const FIXES = [
  { id: "dpi", label: "Rééchantillonner en 300 DPI" },
  { id: "bleed", label: "Ajouter 3 mm de fond perdu" },
  { id: "cmyk", label: "Convertir le profil RVB → CMJN" },
  { id: "vector", label: "Vectoriser les textes" },
  { id: "support", label: "Changer le support d'impression" },
  { id: "overprint", label: "Désactiver la surimpression du blanc" },
];

interface Order {
  client: string;
  job: string;
  support: string;
  specs: string[];
  issues: string[];
}

const ORDERS: Order[] = [
  {
    client: "Boulangerie Le Croissant",
    job: "Flyers A5 recto/verso — 5 000 ex.",
    support: "Papier couché 135 g",
    specs: ["Résolution : 96 DPI", "Profil : sRGB", "Fond perdu : 0 mm", "Textes : vectorisés"],
    issues: ["dpi", "cmyk", "bleed"],
  },
  {
    client: "Hôtel Songhaï",
    job: "Bâche événementielle 3×2 m",
    support: "Papier couché 350 g",
    specs: ["Résolution : 150 DPI (grand format, OK)", "Profil : CMJN", "Fond perdu : 10 mm", "Textes : polices non incorporées"],
    issues: ["vector", "support"],
  },
  {
    client: "Clinique Sainte-Rita",
    job: "Badges PVC personnalisés — 120 ex.",
    support: "Vinyle adhésif",
    specs: ["Résolution : 300 DPI", "Profil : sRGB", "Fond perdu : 3 mm", "Textes : vectorisés"],
    issues: ["cmyk", "support"],
  },
  {
    client: "STAF Print Center",
    job: "Cartes de visite pelliculées",
    support: "Papier couché 350 g",
    specs: ["Résolution : 300 DPI", "Profil : CMJN (Fogra39)", "Fond perdu : 3 mm", "Textes : vectorisés"],
    issues: [],
  },
  {
    client: "Garage Atlantique",
    job: "Habillage véhicule utilitaire",
    support: "Papier couché 135 g",
    specs: ["Résolution : 72 DPI", "Profil : CMJN", "Fond perdu : 0 mm", "Blanc en surimpression"],
    issues: ["dpi", "bleed", "support", "overprint"],
  },
  {
    client: "Université de Porto-Novo",
    job: "Affiches A2 colloque — 300 ex.",
    support: "Papier couché 170 g",
    specs: ["Résolution : 220 DPI", "Profil : RVB", "Fond perdu : 3 mm", "Textes : calques vivants"],
    issues: ["dpi", "cmyk", "vector"],
  },
];

export function PrintingMaster({ profile, setScore, setStatus, onFinish }: GameProps) {
  const [orders] = useState(() => sample(ORDERS, 4).map((o) => ({ ...o, issues: shuffle(o.issues) })));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setLocalScore] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const order = orders[index]!;
  const remaining = useMemo(() => orders.length - index, [index]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  function validate() {
    const expected = new Set(order.issues);
    const got = new Set(selected);
    const missed = [...expected].filter((i) => !got.has(i)).length;
    const wrong = [...got].filter((i) => !expected.has(i)).length;
    const clean = missed === 0 && wrong === 0;

    const gained = clean ? 120 : Math.max(-40, 60 - missed * 40 - wrong * 25);
    const nextScore = Math.max(0, score + gained);
    setLocalScore(nextScore);
    setScore(nextScore);
    if (clean) setPerfect((p) => p + 1);
    else setPenalties((p) => p + 1);

    setFeedback({
      ok: clean,
      text: clean
        ? "BAT validé ! Fichier conforme, bon pour tirage."
        : `${missed} défaut(s) non corrigé(s), ${wrong} correction(s) inutile(s).`,
    });
    setStatus(`Fichier ${index + 1}/${orders.length}`);
  }

  function next() {
    const perfectFinal = perfect;
    if (index + 1 >= orders.length) {
      const xp = Math.round(score / 3) + perfectFinal * 20;
      const badges: string[] = [];
      if (penalties === 0) badges.push("bat-clean");
      if (perfectFinal >= 5) badges.push("pixel-perfect");
      onFinish({
        score,
        xp,
        victory: perfectFinal >= 3,
        label: `${perfectFinal}/${orders.length} BAT parfaits`,
        newRecord: score > profile.gamesData.printingMaster.highScore,
        badges,
        patch: {
          printingMaster: {
            highScore: Math.max(score, profile.gamesData.printingMaster.highScore),
            levelsCompleted: profile.gamesData.printingMaster.levelsCompleted + orders.length,
          },
        },
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setFeedback(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <Panel>
        <div className="flex items-center gap-2 text-primary">
          <FileWarning className="size-4" />
          <span className="text-xs uppercase tracking-[0.18em]">Commande client</span>
        </div>
        <h2 className="mt-2 font-display text-2xl">{order.client}</h2>
        <p className="text-sm text-muted-foreground">{order.job}</p>
        <p className="mt-1 text-sm">
          Support demandé : <span className="text-primary">{order.support}</span>
        </p>

        <div className="mt-5 space-y-2 rounded-xl border border-border/70 bg-background/40 p-4 font-mono text-xs">
          {order.specs.map((s) => (
            <p key={s} className="text-muted-foreground">
              › {s}
            </p>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Score" value={String(score)} tone="primary" />
          <Stat label="BAT parfaits" value={String(perfect)} tone="success" />
          <Stat label="Restants" value={String(remaining)} />
        </div>
      </Panel>

      <Panel>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Corrections à appliquer avant tirage
        </p>
        <div className="mt-3 space-y-2">
          {FIXES.map((f) => (
            <ChoiceButton
              key={f.id}
              active={selected.includes(f.id)}
              disabled={!!feedback}
              onClick={() => toggle(f.id)}
            >
              {f.label}
            </ChoiceButton>
          ))}
        </div>

        {feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
              feedback.ok ? "border-success/50 bg-success/10 text-success" : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {feedback.ok ? <CheckCircle2 className="mt-0.5 size-4" /> : <AlertTriangle className="mt-0.5 size-4" />}
            <span>{feedback.text}</span>
          </motion.div>
        ) : null}

        <div className="mt-5 flex gap-2">
          {feedback ? (
            <Button className="w-full" onClick={next}>
              {index + 1 >= orders.length ? "Terminer la session" : "Fichier suivant"}
            </Button>
          ) : (
            <Button className="w-full" onClick={validate}>
              Valider le BAT
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}