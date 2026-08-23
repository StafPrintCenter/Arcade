import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Disc, Navigation, Sparkles } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 font-sans text-foreground overflow-hidden">

      {/* Halo Néon d'Arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-rare/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 size-80 rounded-full bg-primary/10 blur-[110px] pointer-events-none" />

      {/* Carte Glassmorphism Principale */}
      <div className="relative z-10 w-full max-w-4xl rounded-4xl border border-primary/20 bg-card/40 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all">

        {/* Top Bar Status */}
        <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-5 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-rare/30 bg-rare/10 px-4 py-1.5 text-xs font-bold text-rare shadow-sm">
            <Sparkles className="size-3.5 animate-spin" />
            <span>SECTEUR INEXPLORÉ</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            ERR // 404_VOID
          </span>
        </div>

        {/* Structure en 2 Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Colonne Gauche : Visual & Badge Holo */}
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-background/50 border border-border/60 text-center">
            <div className="relative mb-6 flex size-28 items-center justify-center rounded-3xl bg-linear-to-br from-rare/20 to-primary/20 border border-primary/30 shadow-inner">
              <Disc className="size-14 text-primary animate-pulse" />
              <Compass className="absolute size-7 text-rare" />
            </div>

            <span className="font-display text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary to-rare">
              404
            </span>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-2">
              Signal Périmétrique Perdu
            </span>
          </div>

          {/* Colonne Droite : Explication & Console de Navigation */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Coordonnées introuvables
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Vous avez dévié de la carte des défis. Cette arène n'existe pas ou est actuellement hors signal dans le système SPC Arcade.
              </p>
            </div>

            {/* Fiche de Diagnostic */}
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>TARGET_NODE:</span>
                <span className="text-destructive font-semibold">[UNRESOLVED]</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>RECOMMENDATION:</span>
                <span className="text-primary font-semibold">RECONNECT_HUB</span>
              </div>
            </div>

            {/* Boutons d'Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background/80 hover:bg-muted px-4 py-3 text-xs font-bold text-foreground transition active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                Retour
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary to-rare px-4 py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 active:scale-95 text-center"
              >
                <Navigation className="size-4" />
                Hub Arcade
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}