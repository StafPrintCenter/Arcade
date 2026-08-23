import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Palette, Type as TypeIcon, LayoutGrid } from "lucide-react";
import { ChoiceButton, Panel, Stat, type GameProps } from "../game-kit";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const ROUNDS = 9;

type Kind = "color" | "typo" | "layout";
const ORDER: Kind[] = ["color", "typo", "layout"];

function cmykToRgb(c: number, m: number, y: number, k: number) {
  const f = (v: number) => Math.round(255 * (1 - v / 100) * (1 - k / 100));
  return `rgb(${f(c)}, ${f(m)}, ${f(y)})`;
}

const FONTS = [
  { family: "Georgia, serif", answer: "Serif" },
  { family: '"Inter Tight", sans-serif', answer: "Sans-Serif" },
  { family: '"Fraunces", serif', answer: "Display" },
  { family: '"Brush Script MT", cursive', answer: "Script" },
];
const FONT_OPTIONS = ["Serif", "Sans-Serif", "Display", "Script"];

export function SkillArcade({ profile, setScore, setStatus, onFinish }: GameProps) {
  const [round, setRound] = useState(0);
  const [score, setLocalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [perfectColor, setPerfectColor] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const kind = ORDER[round % ORDER.length]!;

  // Color matcher state
  const target = useMemo(() => {
    const seed = round * 37;
    return { c: (seed * 13) % 90, m: (seed * 29 + 20) % 90, y: (seed * 7 + 45) % 90, k: (seed * 3) % 25 };
  }, [round]);
  const [cmyk, setCmyk] = useState({ c: 50, m: 50, y: 50, k: 10 });

  // Typo state
  const font = useMemo(() => FONTS[(round * 5) % FONTS.length]!, [round]);
  const [timeLeft, setTimeLeft] = useState(3);

  // Layout state
  const [placement, setPlacement] = useState<Record<string, number | null>>({
    Titre: null,
    Visuel: null,
    "Bouton CTA": null,
  });
  const LAYOUT_ANSWER: Record<string, number> = { Titre: 0, Visuel: 4, "Bouton CTA": 7 };
  const [holding, setHolding] = useState<string | null>("Titre");

  const award = useCallback(
    (points: number, ok: boolean, note: string) => {
      const nextScore = Math.max(0, score + points);
      const nextStreak = ok ? streak + 1 : 0;
      setLocalScore(nextScore);
      setScore(nextScore);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setFeedback(note);
    },
    [score, setScore, streak],
  );

  // 3s countdown for typography rounds
  useEffect(() => {
    if (kind !== "typo" || feedback) return;
    setTimeLeft(3);
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [kind, round, feedback]);

  useEffect(() => {
    if (kind === "typo" && timeLeft <= 0 && !feedback) {
      award(-20, false, "Trop lent ! La police n'a pas été identifiée à temps.");
    }
  }, [timeLeft, kind, feedback, award]);

  useEffect(() => {
    setStatus(`Défi ${Math.min(round + 1, ROUNDS)}/${ROUNDS} • série ${streak}`);
  }, [round, streak, setStatus]);

  function next() {
    if (round + 1 >= ROUNDS) {
      const badges: string[] = [];
      if (perfectColor) badges.push("maitre-cmjn");
      if (bestStreak >= 10) badges.push("serie-10");
      onFinish({
        score,
        xp: Math.round(score / 4),
        victory: score > 400,
        label: `Meilleure série : ${bestStreak}`,
        newRecord: bestStreak > profile.gamesData.skillArcade.bestStreak,
        badges,
        patch: {
          skillArcade: {
            minigamesPlayed: profile.gamesData.skillArcade.minigamesPlayed + ROUNDS,
            bestStreak: Math.max(bestStreak, profile.gamesData.skillArcade.bestStreak),
          },
        },
      });
      return;
    }
    setFeedback(null);
    setCmyk({ c: 50, m: 50, y: 50, k: 10 });
    setPlacement({ Titre: null, Visuel: null, "Bouton CTA": null });
    setHolding("Titre");
    setRound((r) => r + 1);
  }

  function validateColor() {
    const delta =
      Math.abs(cmyk.c - target.c) + Math.abs(cmyk.m - target.m) + Math.abs(cmyk.y - target.y) + Math.abs(cmyk.k - target.k);
    if (delta <= 8) {
      setPerfectColor(true);
      award(120, true, `Teinte reproduite (écart ${delta}). Œil de coloriste !`);
    } else if (delta <= 30) {
      award(60, true, `Proche : écart total de ${delta} points CMJN.`);
    } else {
      award(-15, false, `Raté : écart de ${delta} points CMJN.`);
    }
  }

  function validateLayout() {
    const ok = Object.entries(LAYOUT_ANSWER).every(([k, v]) => placement[k] === v);
    if (ok) award(100, true, "Hiérarchie visuelle respectée, règle des tiers validée.");
    else award(-15, false, "Composition déséquilibrée : revoyez la règle des tiers.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <Panel>
        {kind === "color" ? (
          <>
            <div className="flex items-center gap-2 text-primary">
              <Palette className="size-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Color Matcher CMJN</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border p-3 text-center">
                <div className="h-24 rounded-xl" style={{ background: cmykToRgb(target.c, target.m, target.y, target.k) }} />
                <p className="mt-2 text-xs text-muted-foreground">Teinte cible</p>
              </div>
              <div className="rounded-2xl border border-border p-3 text-center">
                <div className="h-24 rounded-xl" style={{ background: cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k) }} />
                <p className="mt-2 text-xs text-muted-foreground">Votre mélange</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {(["c", "m", "y", "k"] as const).map((ch) => (
                <div key={ch}>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{{ c: "Cyan", m: "Magenta", y: "Jaune", k: "Noir" }[ch]}</span>
                    <span>{cmyk[ch]}%</span>
                  </div>
                  <Slider
                    value={[cmyk[ch]]}
                    max={100}
                    step={1}
                    disabled={!!feedback}
                    onValueChange={([v]) => setCmyk((s) => ({ ...s, [ch]: v ?? 0 }))}
                  />
                </div>
              ))}
            </div>
            {!feedback ? (
              <Button className="mt-5 w-full" onClick={validateColor}>
                Valider la teinte
              </Button>
            ) : null}
          </>
        ) : null}

        {kind === "typo" ? (
          <>
            <div className="flex items-center gap-2 text-primary">
              <TypeIcon className="size-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Speed Typography - {Math.max(0, timeLeft)}s</span>
            </div>
            <motion.p
              key={round}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="my-6 text-center text-5xl"
              style={{ fontFamily: font.family }}
            >
              STAF Print
            </motion.p>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((o) => (
                <ChoiceButton
                  key={o}
                  disabled={!!feedback}
                  onClick={() =>
                    o === font.answer
                      ? award(80, true, "Bonne famille typographique !")
                      : award(-20, false, `Non : il s'agissait d'une police ${font.answer}.`)
                  }
                >
                  {o}
                </ChoiceButton>
              ))}
            </div>
          </>
        ) : null}

        {kind === "layout" ? (
          <>
            <div className="flex items-center gap-2 text-primary">
              <LayoutGrid className="size-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Layout Fixer - règle des tiers</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Sélectionnez un élément puis placez-le dans la bonne zone de la bannière.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.keys(placement).map((el) => (
                <button
                  key={el}
                  type="button"
                  onClick={() => setHolding(el)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${holding === el ? "border-primary bg-primary/20 text-primary" : "border-border bg-secondary/40"
                    }`}
                >
                  {el}
                  {placement[el] !== null ? " ✓" : ""}
                </button>
              ))}
            </div>
            <div className="mt-4 grid aspect-[3/1] grid-cols-3 grid-rows-3 gap-1 rounded-xl border border-border bg-background/40 p-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const label = Object.keys(placement).find((k) => placement[k] === i);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => holding && setPlacement((p) => ({ ...p, [holding]: i }))}
                    className="rounded-md border border-dashed border-border/70 text-[10px] text-muted-foreground transition hover:border-primary/70 hover:bg-primary/10"
                  >
                    {label ?? ""}
                  </button>
                );
              })}
            </div>
            {!feedback ? (
              <Button className="mt-4 w-full" onClick={validateLayout}>
                Valider la composition
              </Button>
            ) : null}
          </>
        ) : null}

        {feedback ? (
          <div className="mt-5 space-y-3">
            <p className="rounded-xl border border-border bg-secondary/40 p-3 text-sm">{feedback}</p>
            <Button className="w-full" onClick={next}>
              {round + 1 >= ROUNDS ? "Terminer la session" : "Défi suivant"}
            </Button>
          </div>
        ) : null}
      </Panel>

      <Panel className="h-fit">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Score" value={String(score)} tone="primary" />
          <Stat label="Série" value={String(streak)} tone="success" />
          <Stat label="Meilleure série" value={String(bestStreak)} tone="rare" />
          <Stat label="Défi" value={`${Math.min(round + 1, ROUNDS)}/${ROUNDS}`} />
        </div>
      </Panel>
    </div>
  );
}