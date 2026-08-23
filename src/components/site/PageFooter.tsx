import { SITE } from "@/data/site";

export function PageFooter() {
  const landingBase = SITE.landing.replace(/\/$/, "");

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col items-center justify-center gap-2 px-6 py-4 text-center sm:flex-row sm:gap-3 sm:py-0">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.shortName} · Tous droits réservés.
        </p>

        {/* Séparateur masqué sur mobile */}
        <span className="hidden text-xs text-muted-foreground/60 sm:inline">|</span>

        {/* Liens légaux */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <a
            href={`${landingBase}/legal/mentions`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Mentions légales
          </a>
          <span>·</span>
          <a
            href={`${landingBase}/legal/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Confidentialité
          </a>
          <span>·</span>
          <a
            href={`${landingBase}/legal/mentions#cookies`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Cookies
          </a>
        </div>

        {/* Séparateur masqué sur mobile */}
        <span className="hidden text-xs text-muted-foreground/60 sm:inline">|</span>

        <p className="text-xs text-muted-foreground">
          Un service fourni par{" "}
          <a
            href={SITE.landing}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            {SITE.name}
          </a>
        </p>
      </div>
    </footer>
  );
}