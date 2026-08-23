import type { ArcadeProfile, GameResult } from "@/lib/arcade/types";
import { cn } from "@/lib/utils";

export interface GameProps {
  profile: ArcadeProfile;
  setScore: (n: number) => void;
  setStatus: (s: string) => void;
  onFinish: (r: GameResult) => void;
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("card-arcade p-5 sm:p-6", className)}>{children}</div>;
}

export function Stat({ label, value, tone }: { label: string; value: string; tone?: "primary" | "success" | "rare" }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-display text-lg font-semibold",
          tone === "primary" && "text-primary",
          tone === "success" && "text-success",
          tone === "rare" && "text-rare",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function ChoiceButton({
  active,
  onClick,
  children,
  tone = "default",
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: "default" | "good" | "bad";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left text-sm transition-all hover:border-primary/60 hover:bg-secondary/70 disabled:opacity-60",
        active && "border-primary bg-primary/15 text-foreground neon-glow",
        tone === "good" && "border-success bg-success/15",
        tone === "bad" && "border-destructive bg-destructive/15",
      )}
    >
      {children}
    </button>
  );
}