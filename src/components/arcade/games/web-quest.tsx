import { useEffect, useState } from "react";
import { Lightbulb, Lock, Timer } from "lucide-react";
import { ChoiceButton, Panel, Stat, type GameProps } from "../game-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TOTAL_SECONDS = 15 * 60;

const CHAPTERS = [
  {
    id: "design",
    title: "Étape 1 - Charte couleur",
    brief:
      "Le fichier de la campagne VIP a perdu sa couleur d'accent. Saisissez le code hexadécimal officiel de l'orange STAF PRINT CENTER.",
    hint: "Un orange vibrant, équivalent CMJN 0 / 62 / 95 / 2.",
    type: "input" as const,
    answers: ["#f97316", "f97316"],
  },
  {
    id: "web",
    title: "Étape 2 - Debug Flexbox",
    brief:
      "Le bouton « Commander » est collé à gauche du conteneur .toolbar { display:flex; }. Quelle correction CSS le recentre et l'aligne verticalement ?",
    hint: "Deux propriétés flex gouvernent les axes principal et transversal.",
    type: "choice" as const,
    options: [
      "text-align: center; vertical-align: middle;",
      "justify-content: center; align-items: center;",
      "float: none; margin: auto 0;",
      "position: absolute; left: 50%;",
    ],
    correct: 1,
  },
  {
    id: "print",
    title: "Étape 3 - Découpe vectorielle",
    brief:
      "Le traceur doit lire le tracé de coupe. Quel réglage envoyer avant lancement de la découpe des stickers ?",
    hint: "Le tracé de coupe est un ton direct nommé par convention.",
    type: "choice" as const,
    options: [
      "Calque « CutContour » en ton direct, surimpression activée, offset 0 mm",
      "Tracé noir 100 % en CMJN, offset 5 mm",
      "Contour blanc RVB, mode aplati",
      "Aucun tracé : découpe automatique par détection de contraste",
    ],
    correct: 0,
  },
];

export function WebQuest({ profile, setScore, setStatus, onFinish }: GameProps) {
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(TOTAL_SECONDS);
  const [value, setValue] = useState("");
  const [pick, setPick] = useState<number | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const chapter = CHAPTERS[step]!;

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    setStatus(`${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} restantes`);
    if (left === 0 && !done) {
      setDone(true);
      onFinish({
        score: step * 200,
        xp: step * 40,
        victory: false,
        label: `Temps écoulé - ${step}/3 énigmes`,
      });
    }
  }, [left, done, step, setStatus, onFinish]);

  function finishQuest(usedSeconds: number, chaptersDone: string[], hintCount: number, errCount: number) {
    setDone(true);
    const score = Math.max(200, 2000 - usedSeconds * 2 - errCount * 100 - hintCount * 80);
    const badges = ["escape-artist"];
    if (hintCount === 0) badges.push("sans-indice");
    const best = profile.gamesData.webQuest.bestTimeSeconds;
    onFinish({
      score,
      xp: Math.round(score / 5),
      victory: true,
      label: `Projet livré en ${Math.floor(usedSeconds / 60)} min ${usedSeconds % 60}s`,
      newRecord: best === 0 || usedSeconds < best,
      badges,
      patch: {
        webQuest: {
          completedChapters: [...new Set([...profile.gamesData.webQuest.completedChapters, ...chaptersDone])],
          bestTimeSeconds: best === 0 ? usedSeconds : Math.min(best, usedSeconds),
        },
      },
    });
  }

  function submit() {
    const ok =
      chapter.type === "input"
        ? chapter.answers!.includes(value.trim().toLowerCase())
        : pick === chapter.correct;

    if (!ok) {
      setErrors((e) => e + 1);
      setLeft((s) => Math.max(0, s - 20));
      setMessage("Mauvaise réponse : 20 secondes de pénalité.");
      return;
    }

    const nextStep = step + 1;
    setScore(nextStep * 300);
    setMessage(null);
    setValue("");
    setPick(null);

    if (nextStep >= CHAPTERS.length) {
      finishQuest(TOTAL_SECONDS - left, CHAPTERS.map((c) => c.id), hints.length, errors);
      return;
    }
    setStep(nextStep);
  }

  function useHint() {
    if (hints.includes(chapter.id)) return;
    setHints((h) => [...h, chapter.id]);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Panel>
        <div className="flex items-center gap-2 text-primary">
          <Lock className="size-4" />
          <span className="text-xs uppercase tracking-[0.18em]">Salle {step + 1} / {CHAPTERS.length}</span>
        </div>
        <h2 className="mt-2 font-display text-2xl">{chapter.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{chapter.brief}</p>

        <div className="mt-5 space-y-2">
          {chapter.type === "input" ? (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="#______"
              className="font-mono"
            />
          ) : (
            chapter.options!.map((o, i) => (
              <ChoiceButton key={o} active={pick === i} onClick={() => setPick(i)}>
                <code className="text-xs">{o}</code>
              </ChoiceButton>
            ))
          )}
        </div>

        {hints.includes(chapter.id) ? (
          <p className="mt-4 rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm text-primary">
            Indice : {chapter.hint}
          </p>
        ) : null}
        {message ? <p className="mt-3 text-sm text-destructive">{message}</p> : null}

        <div className="mt-5 flex gap-2">
          <Button className="flex-1" onClick={submit} disabled={done}>
            Déverrouiller
          </Button>
          <Button variant="secondary" onClick={useHint} disabled={hints.includes(chapter.id)}>
            <Lightbulb className="mr-1 size-4" /> Indice (−80 pts)
          </Button>
        </div>
      </Panel>

      <Panel className="h-fit">
        <div className="flex items-center gap-2 text-primary">
          <Timer className="size-4" />
          <span className="text-xs uppercase tracking-[0.18em]">Compte à rebours</span>
        </div>
        <p className="mt-2 font-display text-4xl tabular-nums">
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat label="Erreurs" value={String(errors)} />
          <Stat label="Indices" value={String(hints.length)} tone="rare" />
        </div>
        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          {CHAPTERS.map((c, i) => (
            <p key={c.id} className={i < step ? "text-success" : ""}>
              {i < step ? "✓" : "•"} {c.title}
            </p>
          ))}
        </div>
      </Panel>
    </div>
  );
}