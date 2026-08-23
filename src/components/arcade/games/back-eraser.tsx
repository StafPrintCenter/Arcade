import { useEffect, useMemo, useState } from "react";
import { Panel, Stat, type GameProps } from "@/components/arcade/game-kit";
import { Button } from "@/components/ui/button";
import { pick, randInt } from "@/lib/arcade/random";
import { cn } from "@/lib/utils";

const SIZE = 14;

const SUBJECTS = ["portrait", "bouteille", "feuille", "voiture", "ampoule"] as const;
type Subject = (typeof SUBJECTS)[number];

const BACKGROUNDS = ["#38bdf8", "#a78bfa", "#34d399", "#f472b6", "#facc15"];

const SUBJECT_LABELS: Record<Subject, string> = {
  portrait: "Portrait en buste",
  bouteille: "Bouteille",
  feuille: "Feuille d'arbre",
  voiture: "Silhouette de voiture",
  ampoule: "Ampoule",
};

function buildSubject(kind: Subject, seed: number) {
  const s: boolean[] = [];
  const c = (SIZE - 1) / 2;
  const off = (seed % 3) - 1;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - c - off;
      let on = false;
      switch (kind) {
        case "portrait":
          on = Math.hypot(dx, y - 3) < 2.6 || (y > 5 && y < SIZE - 1 && Math.abs(dx) < 3.4 - (SIZE - 1 - y) * 0.15);
          break;
        case "bouteille":
          on = (y < 4 && Math.abs(dx) < 1) || (y >= 4 && y < 6 && Math.abs(dx) < 1 + (y - 3) * 0.9) || (y >= 6 && y < SIZE - 1 && Math.abs(dx) < 2.8);
          break;
        case "feuille":
          on = Math.hypot(dx * 1.6, y - c) < 5.2 && Math.abs(dx) + Math.abs(y - c) < 8;
          break;
        case "voiture":
          on = (y > 6 && y < 10 && Math.abs(dx) < 5.4) || (y > 4 && y <= 6 && Math.abs(dx) < 3.2) || (y === 10 && (Math.abs(dx + 3) < 1.4 || Math.abs(dx - 3) < 1.4));
          break;
        case "ampoule":
          on = Math.hypot(dx, y - 4.5) < 3.4 || (y > 8 && y < 12 && Math.abs(dx) < 1.6);
          break;
      }
      s.push(on);
    }
  }
  return s;
}

export function BackEraser({ setScore, setStatus, onFinish }: GameProps) {
  const [kind] = useState<Subject>(() => pick(SUBJECTS));
  const [seed] = useState(() => randInt(0, 99));
  const [bg] = useState(() => pick(BACKGROUNDS));
  const subject = useMemo(() => buildSubject(kind, seed), [kind, seed]);
  const [erased, setErased] = useState<boolean[]>(() => new Array(SIZE * SIZE).fill(false));
  const [brush, setBrush] = useState(1);

  const stats = useMemo(() => {
    let bgTotal = 0, bgErased = 0, cut = 0;
    subject.forEach((isSubject, i) => {
      if (isSubject) {
        if (erased[i]) cut++;
      } else {
        bgTotal++;
        if (erased[i]) bgErased++;
      }
    });
    const clean = Math.round((bgErased / bgTotal) * 100);
    const score = Math.max(0, clean - cut * 4);
    return { clean, cut, score };
  }, [erased, subject]);

  useEffect(() => setStatus(`${stats.clean}% de fond effacé • ${stats.cut} bavures`), [stats, setStatus]);
  useEffect(() => setScore(stats.score), [stats.score, setScore]);

  function erase(i: number) {
    setErased((e) => {
      const next = [...e];
      const x = i % SIZE, y = Math.floor(i / SIZE);
      for (let dy = -(brush - 1); dy <= brush - 1; dy++) {
        for (let dx = -(brush - 1); dx <= brush - 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) next[ny * SIZE + nx] = true;
        }
      }
      return next;
    });
  }

  function finish() {
    onFinish({
      score: stats.score,
      xp: Math.round(stats.score * 1.1),
      label: `Détourage : ${stats.clean}% de fond retiré, ${stats.cut} bavures`,
      victory: stats.clean >= 90 && stats.cut === 0,
      patch: { backEraser: { bestScore: stats.score, played: 1 } },
      badges: stats.clean >= 95 && stats.cut === 0 ? ["detourage-pro"] : [],
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Effacez le fond - sujet : {SUBJECT_LABELS[kind]}</p>
        <div
          className="mx-auto mt-4 grid max-w-md overflow-hidden rounded-xl border border-border"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0,1fr))`, background: "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 16px 16px" }}
        >
          {subject.map((isSubject, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={(e) => e.buttons === 1 && erase(i)}
              onClick={() => erase(i)}
              className="aspect-square"
              style={{
                background: erased[i] ? "transparent" : isSubject ? "#f97316" : bg,
              }}
            />
          ))}
        </div>
        <Button className="mt-5 w-full" onClick={finish}>
          Valider le détourage
        </Button>
      </Panel>
      <div className="space-y-3">
        <Stat label="Fond effacé" value={`${stats.clean}%`} tone="success" />
        <Stat label="Bavures sujet" value={`${stats.cut}`} tone="rare" />
        <Panel className="p-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Gomme</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBrush(b)}
                className={cn("flex-1 rounded-lg border border-border bg-secondary/40 py-2 text-sm", brush === b && "border-primary bg-primary/15")}
              >
                {b === 1 ? "1px" : b === 2 ? "3px" : "5px"}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Le sujet est orange, le fond coloré change à chaque partie. Glissez pour gommer.</p>
        </Panel>
      </div>
    </div>
  );
}
