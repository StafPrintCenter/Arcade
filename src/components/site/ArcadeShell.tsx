import type { ReactNode } from "react";
import { PageHeader, PageFooter } from "@/components/site";
import { CookieConsent } from "@/components/site";

interface ArcadeShellProps {
  children: ReactNode;
  headerContent?: ReactNode;
}

export function ArcadeShell({ children, headerContent }: ArcadeShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader>{headerContent}</PageHeader>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
      <PageFooter />

      <CookieConsent />
    </div>
  );
}