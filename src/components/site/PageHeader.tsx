import { Link } from "@tanstack/react-router";
import logo from "@/assets/logos.json";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <img src={logo.dc} alt="Logo SPC" className="h-10 md:h-12 w-auto" />
        </Link>
        {children}
      </div>
    </header>
  );
}