import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { SITE, SITE_LINK } from "@/data/site";
import logo from "@/assets/logos.json";
import { NotFoundComponent, ErrorComponent } from "@/components/errors";

const ARCADE_TITLE = `SPC Arcade - Jeux & gamification ${SITE.name}`;
const ARCADE_DESC = `Hub de jeux interactifs et défis technico-créatifs pour tester vos compétences en prépresse, web design, retouche et gestion d'agence.`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { title: ARCADE_TITLE },
      { name: "description", content: ARCADE_DESC },
      { name: "author", content: `${SITE.manager}` },

      /* Open Graph / Facebook / WhatsApp */
      { property: "og:title", content: ARCADE_TITLE },
      { property: "og:description", content: ARCADE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: `SPC Docs - ${SITE.name}` },
      { property: "og:image", content: `${logo.meta}` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `Documentation Officielle ${SITE.name}` },
      { property: "og:url", content: `${SITE_LINK.docsUrl}` },
      { property: "og:locale", content: "fr_BJ" },

      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${logo.meta}` },
      { name: "twitter:title", content: ARCADE_TITLE },
      { name: "twitter:description", content: ARCADE_DESC },
      { name: "twitter:site", content: "@StafPrintCenter" },

      /* Google Verification */
      { name: "google-site-verification", content: "OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_LINK.docsUrl}` },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
