import { Link } from "@tanstack/react-router";
import logo from "@/assets/logos.json";
import { ThemeToggle } from "@/components/arcade/theme-toggle";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <img
            src={logo.dc}
            alt="Logo SPC"
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {children ? (
          <div className="min-w-0 flex-1">
            {children}
          </div>
        ) : null}

        <ThemeToggle />
      </div>
    </header>
  );
}