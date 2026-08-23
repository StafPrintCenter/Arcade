import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Home, Search, ShieldAlert } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 font-sans text-foreground select-none">
      <div className="card-arcade relative z-10 w-full max-w-4xl p-6 sm:p-10">

        {/* Top Status Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-destructive" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-destructive">
              STAGE_NOT_FOUND
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            <Search className="size-3.5 text-primary" />
            <span>ID: 404_NULL_STAGE</span>
          </div>
        </div>

        {/* Structure 2 Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Colonne Gauche : Panneau Visualisation */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-secondary/40 border border-border text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive mb-4">
              <ShieldAlert className="size-8" />
            </div>
            <span className="font-display text-5xl font-black text-foreground tracking-tight">
              404
            </span>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-2">
              Zone non répertoriée
            </span>
          </div>

          {/* Colonne Droite : Explication & Navigation */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rare bg-rare/10 border border-rare/20 rounded-full">
                <Compass className="size-3.5" />
                Défi technico-créatif
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Niveau inaccessible
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Le mini-jeu ou l'arène de test auquel vous tentez d'accéder n'existe pas ou a été déplacé dans le catalogue SPC Arcade.
              </p>
            </div>

            {/* Diagnostic Box */}
            <div className="rounded-xl border border-border bg-background p-3.5 font-mono text-xs space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>TARGET:</span>
                <span className="text-destructive font-bold">[UNRESOLVED_ROUTE]</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>STATUS:</span>
                <span className="text-primary font-bold">ABORTED</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-muted px-4 py-2.5 text-xs font-bold text-foreground transition active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                Précédent
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 px-4 py-2.5 text-xs font-bold transition active:scale-95"
              >
                <Home className="size-4" />
                Hub Arcade
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}