import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { SITE } from "@/data/site";

export const STORAGE_KEY = "spc_arcade_cookie_consent_v1";
const GA_ID = "G-Z2WEXR6BRE";

export type Consent = "accepted" | "declined";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    __spcArcadeGaLoaded?: boolean;
  }
}

export function loadGA() {
  if (typeof window === "undefined" || window.__spcArcadeGaLoaded) return;
  window.__spcArcadeGaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
  });
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

export function updateGaConsent(status: Consent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, status);
  if (status === "accepted") {
    loadGA();
  } else if (window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
    });
  }
}

function setupConsentDefaults() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setupConsentDefaults();
    const saved = localStorage.getItem(STORAGE_KEY) as Consent | null;
    if (saved === "accepted") {
      loadGA();
    } else if (!saved) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    updateGaConsent("accepted");
    setVisible(false);
  };

  const decline = () => {
    updateGaConsent("declined");
    setVisible(false);
  };

  if (!visible) return null;

  const baseUrl = SITE?.frontUrl ?? "";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const mentionsLegalUrl = `${cleanBaseUrl}/legal/mentions#cookies`;

  return (
    <div className="fixed inset-x-3 bottom-3 z-60 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md">
      <div className="rounded-2xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie size={18} />
          </div>
          <div className="text-sm text-foreground/85">
            <p className="font-display font-semibold text-foreground">Gestion des cookies</p>
            <p className="mt-1 text-foreground/70">
              Nous utilisons Google Analytics pour comprendre l'usage du site et l'améliorer. Voir nos{" "}
              <a
                href={mentionsLegalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                mentions légales
              </a>.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            onClick={decline}
            className="cursor-pointer rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}