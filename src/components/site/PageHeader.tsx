import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./";
import { SpcMobLogo, SpcDeskLogo } from "@/components/site";

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
              <SpcMobLogo className="h-10 w-auto sm:hidden" />
              <SpcDeskLogo className="hidden h-10 w-auto sm:block md:h-12" />
            </>
          ) : (
            <SpcDeskLogo className="h-10 w-auto md:h-12" />
          )}
        </Link>

        {/* Zone centrale children */}
        {hasChildren && (
          <div className="mx-2 flex min-w-0 flex-1 items-center sm:mx-4">
            {children}
          </div>
        )}

        <div className="flex shrink-0 items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}