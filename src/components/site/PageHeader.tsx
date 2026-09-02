import { Link } from "@tanstack/react-router";
import logo from "@/assets/logos.json";
import { ThemeToggle } from "@/components/arcade/theme-toggle";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  const hasChildren = Boolean(children);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
          {hasChildren ? (
            <>
              {/* MOBILE avec children : MC (clair) / MW (sombre) */}
              <img
                src={logo.mc}
                alt="Logo SPC"
                className="h-10 w-auto block dark:hidden sm:hidden!"
              />
              <img
                src={logo.mw}
                alt="Logo SPC"
                className="h-10 w-auto hidden dark:block sm:hidden!"
              />

              {/* DESKTOP avec children : DC (clair) / DW (sombre) */}
              <img
                src={logo.dc}
                alt="Logo SPC"
                className="h-10 w-auto hidden sm:block dark:hidden! md:h-12"
              />
              <img
                src={logo.dw}
                alt="Logo SPC"
                className="h-10 w-auto hidden dark:sm:block md:h-12"
              />
            </>
          ) : (
            <>
              {/* SANS children : DC (clair) / DW (sombre) sur tous les écrans */}
              <img
                src={logo.dc}
                alt="Logo SPC"
                className="h-10 w-auto md:h-12 block dark:hidden"
              />
              <img
                src={logo.dw}
                alt="Logo SPC"
                className="h-10 w-auto md:h-12 hidden dark:block"
              />
            </>
          )}
        </Link>

        {/* Zone centrale children */}
        {hasChildren && (
          <div className="flex flex-1 items-center min-w-0 mx-2 sm:mx-4">
            {children}
          </div>
        )}

        {/* Bouton ThemeToggle à droite */}
        <div className="flex items-center shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}