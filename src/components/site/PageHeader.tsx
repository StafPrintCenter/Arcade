import { Link } from "@tanstack/react-router";
import logo from "@/assets/logos.json";
import { ThemeToggle } from "@/components/arcade/theme-toggle";
import { useTheme } from "@/hooks/useTheme";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  const { theme, mounted } = useTheme();
  const isDark = mounted && theme === "dark";
  const hasChildren = Boolean(children);

  // Choix des logos :
  // - Sans children : 'dw' (sombre) / 'dc' (clair)
  // - Avec children : 'mw' / 'mc' sur mobile, 'dw' / 'dc' sur desktop (sm:)
  const desktopLogo = isDark ? logo.dw : logo.dc;
  const mobileLogo = hasChildren ? (isDark ? logo.mw : logo.mc) : desktopLogo;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo dynamique */}
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
          {hasChildren ? (
            <>
              {/* Logo mobile (MC/MW si children) */}
              <img
                src={mobileLogo}
                alt="Logo SPC"
                className="h-10 w-auto sm:hidden"
              />
              {/* Logo desktop (DC/DW) */}
              <img
                src={desktopLogo}
                alt="Logo SPC"
                className="hidden h-10 w-auto sm:block md:h-12"
              />
            </>
          ) : (
            <img
              src={desktopLogo}
              alt="Logo SPC"
              className="h-10 w-auto md:h-12"
            />
          )}
        </Link>

        {/* Zone centrale pour children (ex: infos du jeu) */}
        {hasChildren && (
          <div className="flex flex-1 items-center min-w-0 mx-2 sm:mx-4">
            {children}
          </div>
        )}

        {/* Bouton de thème positionné toujours à droite */}
        <div className="flex items-center shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}