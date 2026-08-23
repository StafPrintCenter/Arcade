import { useEffect, useMemo, useState } from "react";
import { Panel, Stat, ChoiceButton, type GameProps } from "@/components/arcade/game-kit";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/arcade/random";

interface Step {
  title: string;
  question: string;
  options: Array<{ label: string; points: number; feedback: string }>;
}

const STEPS: Step[] = [
  {
    title: "Brief client",
    question: "Une boulangerie de Porto-Novo veut un site vitrine. Par quoi commencez-vous ?",
    options: [
      { label: "Définir l'objectif et l'arborescence des pages", points: 20, feedback: "Exact : structure avant décoration." },
      { label: "Choisir tout de suite un template coloré", points: 5, feedback: "Trop tôt, le contenu dicte la forme." },
      { label: "Coder le header en CSS", points: 0, feedback: "On ne code pas avant d'avoir le plan." },
    ],
  },
  {
    title: "Structure",
    question: "Quelle structure de page d'accueil retenez-vous ?",
    options: [
      { label: "Hero + produits phares + avis + contact/plan", points: 20, feedback: "Parcours clair et orienté conversion." },
      { label: "Un long texte de présentation seul", points: 5, feedback: "Aucun point d'accroche visuel." },
      { label: "Un carrousel de 12 images plein écran", points: 2, feedback: "Lourd et illisible sur mobile." },
    ],
  },
  {
    title: "Palette",
    question: "Le logo est orange et brun. Quelle palette web ?",
    options: [
      { label: "Orange en accent, fonds neutres, texte très contrasté", points: 20, feedback: "Contraste AA respecté." },
      { label: "Orange partout en aplat", points: 5, feedback: "Saturation fatigante, CTA invisible." },
      { label: "Orange sur fond jaune", points: 0, feedback: "Contraste insuffisant." },
    ],
  },
  {
    title: "Typographie",
    question: "Combien de familles de polices et quel usage ?",
    options: [
      { label: "2 familles : une titre affirmée, une texte lisible", points: 20, feedback: "Le duo classique et efficace." },
      { label: "4 familles pour varier", points: 3, feedback: "Incohérence garantie." },
      { label: "1 police décorative pour tout", points: 6, feedback: "Illisible en paragraphe." },
    ],
  },
  {
    title: "Responsive & perf",
    question: "Avant livraison, la priorité technique est :",
    options: [
      { label: "Images compressées + test mobile + balises title/description", points: 20, feedback: "Livraison pro." },
      { label: "Ajouter des animations partout", points: 4, feedback: "Ralentit le site." },
      { label: "Livrer, le client testera", points: 0, feedback: "Jamais." },
    ],
  },
];

export function WebBuilder({ setScore, setStatus, onFinish }: GameProps) {
  const [steps] = useState(() => shuffle(STEPS).map((s) => ({ ...s, options: shuffle(s.options) })));
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const step = steps[index]!;
  const max = useMemo(() => steps.length * 20, [steps.length]);

  useEffect(() => setStatus(`Étape ${index + 1}/${steps.length} - ${step.title}`), [index, setStatus, step.title]);

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const next = points + step.options[i]!.points;
    setPoints(next);
    setScore(next);
  }

  function advance() {
    if (index + 1 < steps.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    const ratio = points / max;
    onFinish({
      score: points,
      xp: Math.round(points * 1.4),
      label: `Site livré avec ${points}/${max} points de qualité`,
      victory: ratio >= 0.7,
      patch: { webBuilder: { bestScore: points, played: 1 } },
      badges: ratio === 1 ? ["webmaster"] : [],
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">{step.title}</p>
        <h2 className="mt-2 font-display text-2xl">{step.question}</h2>
        <div className="mt-5 space-y-3">
          {step.options.map((o, i) => (
            <ChoiceButton
              key={o.label}
              onClick={() => choose(i)}
              disabled={picked !== null}
              tone={picked === null ? "default" : o.points >= 20 ? "good" : picked === i ? "bad" : "default"}
            >
              <span className="block">{o.label}</span>
              {picked !== null ? <span className="mt-1 block text-xs text-muted-foreground">{o.feedback}</span> : null}
            </ChoiceButton>
          ))}
        </div>
        {picked !== null ? (
          <Button className="mt-5 w-full" onClick={advance}>
            {index + 1 < steps.length ? "Étape suivante" : "Livrer le site"}
          </Button>
        ) : null}
      </Panel>
      <div className="space-y-3">
        <Stat label="Qualité" value={`${points}/${max}`} tone="primary" />
        <Stat label="Étape" value={`${index + 1} / ${steps.length}`} />
      </div>
    </div>
  );
}
