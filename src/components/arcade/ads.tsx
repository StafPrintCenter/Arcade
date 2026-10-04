import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, ExternalLink, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADSENSE_CLIENT, FEDAPAY_URL, formatRemaining, isValidCode, isValidReturnToken, useAdFree } from "@/lib/arcade/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdBanner({ slot, className = "" }: { slot: string; className?: string }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (!slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker or not loaded */
    }
  }, [slot]);

  if (!slot) {
    return (
      <a
        href="https://stafprint.com"
        target="_blank"
        rel="noreferrer"
        className={`flex min-h-30 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center ${className}`}
      >
        <Printer className="size-6 text-primary" />
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Espace partenaire</p>
        <p className="font-display text-base">STAF PRINT CENTER - Impression & design à Porto-Novo</p>
      </a>
    );
  }
  return (
    <div className={`min-h-30 overflow-hidden rounded-xl ${className}`}>
      <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Publicité</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdInterstitial({
  slot,
  onContinue,
  onBuyPass,
  seconds = 5,
}: {
  slot: string;
  onContinue: () => void;
  onBuyPass: () => void;
  seconds?: number;
}) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/90 p-4 backdrop-blur">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
        <p className="font-display text-xl">Préparation de votre session…</p>
        <AdBanner slot={slot} className="mt-4" />
        <Button className="mt-5 w-full" disabled={left > 0} onClick={onContinue}>
          {left > 0 ? `Commencer dans ${left}s` : "Commencer le défi"}
        </Button>
        <button onClick={onBuyPass} className="mt-3 w-full text-center text-sm text-primary hover:underline">
          <Crown className="mr-1 inline size-4" /> Supprimer les pubs pendant 1 semaine
        </button>
      </div>
    </div>
  );
}

export function VipPassModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { adFree, until, activate } = useAdFree();
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (isValidCode(code)) {
      activate();
      setError("");
      setCode("");
    } else setError("Code invalide ou expiré. Vérifiez le message reçu après paiement.");
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground cursor-pointer" aria-label="Fermer">
              <X className="size-5" />
            </button>
            <Crown className="size-8 text-primary" />
            <h2 className="mt-2 font-display text-2xl">Pass Zéro Pub - 1 semaine</h2>
            {adFree ? (
              <p className="mt-3 rounded-xl bg-primary/10 p-3 text-sm text-primary">
                👑 Pass actif — encore {formatRemaining(until)}. Merci pour votre soutien !
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Jouez 7 jours sans aucune publicité et soutenez SPC Arcade. Paiement Mobile Money ou carte via FedaPay.
                </p>
                <Button className="mt-5 w-full" asChild>
                  <a href={FEDAPAY_URL} target="_blank" rel="noreferrer">
                    Activer via FedaPay <ExternalLink className="ml-1 size-4" />
                  </a>
                </Button>
                <button
                  onClick={() => setShowCode((s) => !s)}
                  className="mt-4 w-full text-center text-sm text-muted-foreground underline"
                >
                  Déjà payé mais pas redirigé ? Entrez votre code
                </button>
                {showCode ? (
                  <div className="mt-3 space-y-2">
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="SPC-W00-XXXX"
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                    />
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                    <Button variant="secondary" className="w-full" onClick={submit}>
                      Valider le code
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function VipPassButton() {
  const { adFree, until, ready } = useAdFree();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={adFree ? "secondary" : "outline"} size="sm" onClick={() => setOpen(true)}>
        <Crown className="mr-1 size-4 text-primary" />
        {ready && adFree ? `VIP (${formatRemaining(until)})` : "Zéro Pub"}
      </Button>
      <VipPassModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Reads ?payment=fedapay_success&token=... on return from FedaPay. */
export function PaymentReturnHandler() {
  const { activate } = useAdFree();
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("payment") !== "fedapay_success") return;
    if (isValidReturnToken(url.searchParams.get("token"))) {
      activate();
      setMsg("👑 Pass 7 jours sans pub activé ! Bon jeu.");
    } else {
      setMsg("Lien de retour invalide. Utilisez le code reçu après paiement via le bouton « Zéro Pub ».");
    }
    url.searchParams.delete("payment");
    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.toString());
  }, [activate]);
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-xl border border-primary/40 bg-card p-4 text-sm shadow-xl">
      <button onClick={() => setMsg(null)} className="float-right text-muted-foreground cursor-pointer" aria-label="Fermer">
        <X className="size-4" />
      </button>
      {msg}
    </div>
  );
}
