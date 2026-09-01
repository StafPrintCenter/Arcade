import { useState } from "react";
import { motion } from "framer-motion";
import { EyeOff, Lock, ShieldCheck, Share2, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATAR_BASES, GENDERS, SKIN_TONES, withSkinTone } from "@/lib/arcade/data";
import type { ArcadeProfile, Gender } from "@/lib/arcade/types";
import { SITE, SITE_LINK } from "@/data/site";
import { cn } from "@/lib/utils";
import { updateGaConsent } from "@/components/site/CookieConsent";

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/85 p-4 backdrop-blur">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="card-arcade max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function TermsBanner({ onAccept }: { onAccept: () => void }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleAccept = () => {
    updateGaConsent(analyticsEnabled ? "accepted" : "declined");
    onAccept();
  };

  const baseUrl = SITE_LINK.landingUrl;
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const mentionsLegalUrl = `${cleanBaseUrl}/legal/mentions#cookies`;

  return (
    <Overlay>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary neon-glow">
        <ShieldCheck className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-2xl">Conditions & Confidentialité</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Avant de jouer sur SPC Arcade, prenez connaissance de ces quelques règles simples.
      </p>

      <ul className="mt-5 space-y-3 text-sm">
        <li className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            <strong>Données locales uniquement.</strong> Votre pseudo, votre profil et vos scores restent
            enregistrés uniquement dans votre navigateur.
          </span>
        </li>
        <li className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <EyeOff className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            <strong>Vos scores sont privés.</strong> Le classement est strictement local : aucun autre joueur ne
            peut voir vos parties, votre XP ou vos badges.
          </span>
        </li>
        <li className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <Share2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            <strong>Le partage est volontaire.</strong> Vous pouvez partager votre progression quand vous le souhaitez ; jamais automatiquement.
          </span>
        </li>
      </ul>

      {/* Option Analytics intégrée */}
      <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold leading-none text-foreground">
                Google Analytics
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Mesure anonyme d'audience pour améliorer l'expérience.
              </p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-5 w-9 rounded-full bg-border after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none"></div>
          </label>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Les jeux sont pédagogiques et
        fictifs ; les briefs clients sont imaginaires. Vider le cache du navigateur efface votre progression. En savoir plus dans nos{" "}
        <a
          href={mentionsLegalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          mentions légales
        </a>
        .
      </p>

      <Button className="mt-6 w-full cursor-pointer" onClick={handleAccept}>
        J'accepte et je joue
      </Button>
    </Overlay>
  );
}

export function ProfileSetup({
  profile,
  onSave,
  onCancel,
}: {
  profile: ArcadeProfile;
  onSave: (patch: Partial<ArcadeProfile>) => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState(profile.onboarded ? profile.nickname : "");
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [skinTone, setSkinTone] = useState(profile.skinTone || "moyen");
  const [base, setBase] = useState(AVATAR_BASES[profile.gender]?.[0] ?? "🧑");
  const [city, setCity] = useState(profile.city);

  const modifier = SKIN_TONES.find((t) => t.id === skinTone)?.modifier ?? "";
  const bases = AVATAR_BASES[gender] ?? AVATAR_BASES["non-precise"];
  const avatar = withSkinTone(base, modifier);
  const steps = ["Identité", "Teinte de peau", "Avatar"];

  return (
    <Overlay>
      <h2 className="font-display text-2xl">
        {profile.onboarded ? "Modifier mon profil" : "Créez votre profil de joueur"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ces informations restent sur votre appareil et servent uniquement à personnaliser le hub.
      </p>

      <div className="mt-4 flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={cn("h-1.5 rounded-full bg-secondary", i <= step && "bg-primary")} />
            <p className={cn("mt-1 text-[11px] text-muted-foreground", i === step && "text-primary")}>{s}</p>
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Pseudo</label>
            <Input
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Votre nom de joueur"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Ville</label>
            <Input value={city} maxLength={30} onChange={(e) => setCity(e.target.value)} placeholder="Votre ville" />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Sexe</p>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGender(g.id);
                    setBase((AVATAR_BASES[g.id] ?? AVATAR_BASES["non-precise"])[0] ?? "🧑");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm cursor-pointer",
                    gender === g.id && "border-primary bg-primary/15",
                  )}
                >
                  <span className="text-xl">{g.emoji}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Ville</label>
            <Input value={city} maxLength={30} onChange={(e) => setCity(e.target.value)} placeholder="Porto-Novo" />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-5">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">Teinte de peau</p>
          <div className="flex flex-wrap gap-2">
            {SKIN_TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSkinTone(t.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs",
                  skinTone === t.id && "border-primary bg-primary/15 neon-glow",
                )}
              >
                <span className="text-2xl">{withSkinTone(bases[0] ?? "🧑", t.modifier)}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-5">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">Avatar</p>
          <div className="flex flex-wrap gap-2">
            {bases.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBase(b)}
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl border border-border bg-secondary/40 text-2xl",
                  base === b && "border-primary bg-primary/15 neon-glow",
                )}
              >
                {withSkinTone(b, modifier)}
              </button>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3 text-sm">
            <span className="text-3xl">{avatar}</span>
            <span className="text-muted-foreground">
              Aperçu : {nickname.trim() || "Joueur STAF"} — {city.trim() || "Porto-Novo"}
            </span>
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex gap-2">
        {step > 0 ? (
          <Button variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Retour
          </Button>
        ) : null}

        {step < 2 ? (
          <Button
            className="flex-1"
            disabled={step === 0 && nickname.trim().length < 2}
            onClick={() => setStep((s) => s + 1)}
          >
            Continuer
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={() =>
              onSave({
                nickname: nickname.trim() || "Joueur STAF",
                gender,
                skinTone,
                avatar,
                city: city.trim() || "Porto-Novo",
                onboarded: true,
              })
            }
          >
            {profile.onboarded ? "Enregistrer" : "Entrer dans l'Arcade"}
          </Button>
        )}

        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        ) : null}
      </div>
    </Overlay>
  );
}
