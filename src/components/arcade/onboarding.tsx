import { useState } from "react";
import { motion } from "framer-motion";
import { EyeOff, Lock, ShieldCheck, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATARS, GENDERS } from "@/lib/arcade/data";
import type { ArcadeProfile, Gender } from "@/lib/arcade/types";
import { cn } from "@/lib/utils";

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-4 backdrop-blur">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="card-arcade w-full max-w-lg p-6 sm:p-8"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function TermsBanner({ onAccept }: { onAccept: () => void }) {
  return (
    <Overlay>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary neon-glow">
        <ShieldCheck className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-2xl">Conditions d'utilisation de SPC Arcade</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Avant de jouer, prenez connaissance de ces quelques règles simples.
      </p>

      <ul className="mt-5 space-y-3 text-sm">
        <li className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            <strong>Aucune donnée n'est collectée.</strong> Votre pseudo, votre profil et vos scores restent
            enregistrés uniquement dans votre navigateur (stockage local). Rien n'est envoyé à STAF PRINT CENTER
            ni à un tiers.
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
            <strong>Le partage est volontaire.</strong> Vous pouvez partager votre progression sur Facebook,
            LinkedIn, WhatsApp ou X quand vous le souhaitez - jamais automatiquement.
          </span>
        </li>
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        Vider le cache du navigateur efface définitivement votre progression. Les jeux sont pédagogiques et
        fictifs ; les briefs clients sont imaginaires.
      </p>

      <Button className="mt-6 w-full" onClick={onAccept}>
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
  const [nickname, setNickname] = useState(profile.onboarded ? profile.nickname : "");
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [city, setCity] = useState(profile.city);

  return (
    <Overlay>
      <h2 className="font-display text-2xl">
        {profile.onboarded ? "Modifier mon profil" : "Créez votre profil de joueur"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ces informations restent sur votre appareil et servent uniquement à personnaliser le hub.
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Pseudo</label>
          <Input
            value={nickname}
            maxLength={20}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ex : StafMaster229"
          />
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Avatar</p>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl border border-border bg-secondary/40 text-xl",
                  avatar === a && "border-primary bg-primary/15 neon-glow",
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Sexe</p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id)}
                className={cn(
                  "rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm",
                  gender === g.id && "border-primary bg-primary/15",
                )}
              >
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

      <div className="mt-6 flex gap-2">
        <Button
          className="flex-1"
          disabled={nickname.trim().length < 2}
          onClick={() =>
            onSave({
              nickname: nickname.trim(),
              gender,
              avatar,
              city: city.trim() || "Porto-Novo",
              onboarded: true,
            })
          }
        >
          {profile.onboarded ? "Enregistrer" : "Entrer dans l'Arcade"}
        </Button>
        {onCancel ? (
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
        ) : null}
      </div>
    </Overlay>
  );
}
