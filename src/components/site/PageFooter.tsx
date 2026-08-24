import { SITE, SITE_LINK } from "@/data/site";

export function PageFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background/50 py-8 backdrop-blur-xs text-center">
      <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} SPC Arcade · Hub propulsé par{" "}
        <a
          href={SITE_LINK.landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer"
        >
          {SITE.name}
        </a>.
      </p>
    </footer>
  );
}