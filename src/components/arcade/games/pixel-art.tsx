import { useEffect, useMemo, useState } from "react";
import { Panel, Stat, type GameProps } from "@/components/arcade/game-kit";
import { Button } from "@/components/ui/button";
import { pick, randInt } from "@/lib/arcade/random";
import { cn } from "@/lib/utils";

const PALETTE = ["transparent", "#f97316", "#0f172a", "#22c55e", "#e2e8f0"];
const SIZES = [8, 16, 32] as const;

const MOTIFS = ["cible", "diagonale", "damier", "vague", "croix", "sablier"] as const;
type Motif = (typeof MOTIFS)[number];

function buildModel(size: number, motif: Motif, seed: number) {
  const cells: number[] = [];
  const c = (size - 1) / 2;
  const a = 1 + (seed % 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - c, y - c) / (size / 2);
      let v = 0;
      switch (motif) {
        case "cible":
          v = d < 0.25 ? 1 : d < 0.45 ? 2 : d < 0.7 ? 3 : 0;
          break;
        case "diagonale":
          v = Math.abs(x - y) < a ? 1 : x + y > size * 1.4 ? 4 : (x + y) % (size / 2 | 0) === 0 ? 2 : 0;
          break;
        case "damier": {
          const b = Math.max(1, Math.round(size / (4 + (seed % 3))));
          v = (Math.floor(x / b) + Math.floor(y / b)) % 2 === 0 ? 1 : 2;
          break;
        }
        case "vague":
          v = y > c + Math.sin((x / size) * Math.PI * (a + 1)) * (size / 5) ? 1 : x % (a + 2) === 0 ? 3 : 0;
          break;
        case "croix":
          v = Math.abs(x - c) < a || Math.abs(y - c) < a ? 1 : d < 0.85 ? 4 : 0;
          break;
        case "sablier":
          v = Math.abs(x - c) <= Math.abs(y - c) ? 1 : (x + y) % 2 === 0 ? 2 : 0;
          break;
      }
      cells.push(v);
    }
  }
  return cells;
}

export function PixelArt({ setScore, setStatus, onFinish }: GameProps) {
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState(1);
  const [grid, setGrid] = useState<number[]>([]);
  const [motif] = useState<Motif>(() => pick(MOTIFS));
  const [seed] = useState(() => randInt(0, 999));
  const model = useMemo(() => (size ? buildModel(size, motif, seed) : []), [motif, seed, size]);

  const accuracy = useMemo(() => {
    if (!size) return 0;
    const ok = model.filter((v, i) => v === grid[i]).length;
    return Math.round((ok / model.length) * 100);
  }, [grid, model, size]);

  useEffect(() => {
    if (!size) setStatus("Choisissez une difficulté");
    else setStatus(`${size}x${size} • ${accuracy}% de correspondance`);
  }, [accuracy, setStatus, size]);
  useEffect(() => setScore(accuracy), [accuracy, setScore]);

  function start(s: number) {
    setSize(s);
    setGrid(new Array(s * s).fill(0));
  }

  function paint(i: number) {
    setGrid((g) => g.map((v, idx) => (idx === i ? color : v)));
  }

  function finish() {
    if (!size) return;
    const bonus = size === 32 ? 2 : size === 16 ? 1.5 : 1;
    onFinish({
      score: accuracy,
      xp: Math.round(accuracy * bonus),
      label: `Reproduction ${size}x${size} — ${accuracy}% fidèle`,
      victory: accuracy >= 85,
      patch: { pixelArt: { bestScore: accuracy, played: 1 } },
      badges: accuracy >= 90 && size >= 16 ? ["pixel-artiste"] : [],
    });
  }

  if (!size) {
    return (
      <Panel className="mx-auto max-w-md text-center">
        <h2 className="font-display text-2xl">Choisissez la grille</h2>
        <p className="mt-1 text-sm text-muted-foreground">Plus la grille est fine, plus l'XP est élevée.</p>
        <div className="mt-5 grid gap-3">
          {SIZES.map((s) => (
            <Button key={s} variant={s === 8 ? "default" : "secondary"} onClick={() => start(s)}>
              {s} x {s} {s === 8 ? "— Facile" : s === 16 ? "— Moyen" : "— Expert"}
            </Button>
          ))}
        </div>
      </Panel>
    );
  }

  const style = { gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr_220px]">
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Modèle — motif « {motif} »</p>
        <div className="mt-3 grid overflow-hidden rounded-lg border border-border bg-secondary/40" style={style}>
          {model.map((v, i) => (
            <span key={i} className="aspect-square" style={{ background: PALETTE[v] }} />
          ))}
        </div>
      </Panel>
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Votre reproduction</p>
        <div className="mt-3 grid overflow-hidden rounded-lg border border-border bg-secondary/40" style={style}>
          {grid.map((v, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={(e) => e.buttons === 1 && paint(i)}
              onClick={() => paint(i)}
              className="aspect-square border-[0.5px] border-black/10"
              style={{ background: PALETTE[v] }}
            />
          ))}
        </div>
      </Panel>
      <div className="space-y-3">
        <Stat label="Correspondance" value={`${accuracy}%`} tone="primary" />
        <Panel className="p-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Palette</p>
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(i)}
                className={cn("size-8 rounded-lg border-2 border-border", color === i && "border-primary neon-glow")}
                style={{ background: c === "transparent" ? "repeating-conic-gradient(#334155 0% 25%, #1e293b 0% 50%) 50% / 8px 8px" : c }}
              />
            ))}
          </div>
        </Panel>
        <Button className="w-full" onClick={finish}>
          Terminer
        </Button>
      </div>
    </div>
  );
}
