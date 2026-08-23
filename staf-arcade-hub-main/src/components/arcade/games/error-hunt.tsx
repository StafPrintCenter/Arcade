import { useEffect, useState } from "react";
import { Panel, Stat, type GameProps } from "@/components/arcade/game-kit";
import { Button } from "@/components/ui/button";
import { pick, sample } from "@/lib/arcade/random";
import { cn } from "@/lib/utils";

type DefectId = "subtitle" | "body" | "price" | "logo" | "badge" | "cta" | "footer" | "title";

const DEFECTS: Record<DefectId, { label: string; explain: string; ok: string }> = {
  title: {
    label: "Titre principal",
    explain: "Titre étiré horizontalement : déformation typographique interdite.",
    ok: "Titre correct : corps dominant et lisible.",
  },
  subtitle: {
    label: "Sous-titre",
    explain: "Alignement incohérent avec le reste du bloc texte.",
    ok: "Sous-titre bien aligné sur le titre.",
  },
  body: {
    label: "Paragraphe",
    explain: "Contraste insuffisant : illisible à l'impression.",
    ok: "Paragraphe lisible, contraste suffisant.",
  },
  price: {
    label: "Prix",
    explain: "Hiérarchie inversée : l'info clé est la plus petite.",
    ok: "Prix mis en avant : hiérarchie respectée.",
  },
  logo: {
    label: "Logo",
    explain: "Marge de sécurité absente autour du logo.",
    ok: "Logo correctement dégagé du bord.",
  },
  badge: {
    label: "Pastille promo",
    explain: "Couleur hors charte : incohérence chromatique.",
    ok: "Pastille dans la charte orange/slate.",
  },
  cta: {
    label: "Bouton d'action",
    explain: "CTA trop petit et peu contrasté : il passe inaperçu.",
    ok: "CTA bien contrasté et assez grand.",
  },
  footer: {
    label: "Mentions légales",
    explain: "Mentions illisibles : corps trop faible et gris sur gris.",
    ok: "Mentions discrètes mais lisibles.",
  },
};

const ALL: DefectId[] = ["title", "subtitle", "body", "price", "logo", "badge", "cta", "footer"];

const BRIEFS = [
  { title: "Impression grand format", sub: "Bâches, roll-up, vitrophanies", price: "à partir de 12 000 FCFA / m²" },
  { title: "Cartes de visite premium", sub: "Pelliculage soft touch, dorure", price: "à partir de 25 000 FCFA / 100 ex." },
  { title: "Flyers A5 quadri", sub: "Recto/verso, papier couché 135 g", price: "à partir de 45 000 FCFA / 1000 ex." },
  { title: "Habillage véhicule", sub: "Covering vinyle coulé, pose incluse", price: "à partir de 350 000 FCFA" },
];

export function ErrorHunt({ setScore, setStatus, onFinish }: GameProps) {
  const [brief] = useState(() => pick(BRIEFS));
  const [bad] = useState<DefectId[]>(() => sample(ALL, 3 + Math.floor(Math.random() * 3)));
  const [picked, setPicked] = useState<DefectId[]>([]);
  const [done, setDone] = useState(false);

  const totalBad = bad.length;
  const found = picked.filter((id) => bad.includes(id)).length;
  const wrong = picked.length - found;

  useEffect(() => setStatus(`${found}/${totalBad} erreurs • ${wrong} faux positifs`), [found, wrong, totalBad, setStatus]);
  useEffect(() => setScore(Math.max(0, found * 20 - wrong * 10)), [found, wrong, setScore]);

  function toggle(id: DefectId) {
    if (done) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function validate() {
    setDone(true);
    const score = Math.max(0, found * 20 - wrong * 10);
    onFinish({
      score,
      xp: Math.round(score * 1.3),
      label: `${found}/${totalBad} erreurs repérées, ${wrong} faux positifs`,
      victory: found === totalBad && wrong === 0,
      patch: { errorHunt: { bestScore: score, played: 1 } },
      badges: found === totalBad && wrong === 0 ? ["oeil-de-lynx"] : [],
    });
  }

  const zone = (id: DefectId, extra?: string) =>
    cn(
      "cursor-pointer rounded-lg border-2 border-transparent transition-colors",
      picked.includes(id) && "border-orange-500 bg-orange-500/10",
      done && bad.includes(id) && "border-emerald-500 bg-emerald-500/10",
      done && picked.includes(id) && !bad.includes(id) && "border-red-500 bg-red-500/10",
      extra,
    );

  const has = (id: DefectId) => bad.includes(id);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <Panel>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">
          Cliquez sur chaque défaut de la composition
        </p>
        <div className="relative mt-4 overflow-hidden rounded-2xl bg-white p-6 text-slate-900">
          <div className={zone("logo", has("logo") ? "absolute right-0 top-0 p-0" : "absolute right-4 top-4")} onClick={() => toggle("logo")}>
            <span className="block px-1 text-[10px] font-bold uppercase tracking-widest">STAF PRINT</span>
          </div>

          <div className={zone("title", "inline-block")} onClick={() => toggle("title")}>
            <h3 className={cn("font-display text-3xl leading-tight", has("title") && "scale-x-[1.35] origin-left")}>
              {brief.title}
            </h3>
          </div>

          <div className={zone("subtitle", has("subtitle") ? "ml-10 mt-2 inline-block" : "mt-2 inline-block")} onClick={() => toggle("subtitle")}>
            <p className="text-lg">{brief.sub}</p>
          </div>

          <div className={zone("body", "mt-3")} onClick={() => toggle("body")}>
            <p className={cn("text-sm", has("body") ? "text-slate-300" : "text-slate-600")}>
              Nos ateliers de Porto-Novo impriment vos supports en 48h avec finitions au choix et livraison incluse.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className={zone("price")} onClick={() => toggle("price")}>
              <p className={has("price") ? "text-[9px]" : "text-xl font-bold"}>{brief.price}</p>
            </div>
            <div className={zone("badge")} onClick={() => toggle("badge")}>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold text-white",
                  has("badge") ? "bg-violet-600" : "bg-slate-900",
                )}
              >
                Nouveau
              </span>
            </div>
          </div>

          <div className={zone("cta", "mt-4 inline-block")} onClick={() => toggle("cta")}>
            <span
              className={cn(
                "inline-block rounded-lg font-semibold",
                has("cta") ? "bg-orange-100 px-2 py-0.5 text-[10px] text-orange-300" : "bg-orange-500 px-5 py-2 text-sm text-white",
              )}
            >
              Demander un devis
            </span>
          </div>

          <div className={zone("footer", "mt-4")} onClick={() => toggle("footer")}>
            <p className={cn(has("footer") ? "text-[6px] text-slate-300" : "text-[10px] text-slate-500")}>
              Offre valable jusqu'au 30/09 — STAF PRINT CENTER, Porto-Novo.
            </p>
          </div>
        </div>

        {!done ? (
          <Button className="mt-5 w-full" onClick={validate}>
            Valider mon analyse
          </Button>
        ) : (
          <div className="mt-5 space-y-2">
            {ALL.filter((id) => bad.includes(id) || picked.includes(id)).map((id) => (
              <p key={id} className="text-xs text-muted-foreground">
                <span className={bad.includes(id) ? "text-success" : "text-destructive"}>{DEFECTS[id].label}</span>{" "}
                — {bad.includes(id) ? DEFECTS[id].explain : DEFECTS[id].ok}
              </p>
            ))}
          </div>
        )}
      </Panel>
      <div className="space-y-3">
        <Stat label="Erreurs trouvées" value={`${found}/${totalBad}`} tone="success" />
        <Stat label="Faux positifs" value={`${wrong}`} tone="rare" />
        <Panel className="p-4 text-xs text-muted-foreground">
          La composition change à chaque partie : alignement, contraste, hiérarchie, marges du logo, cohérence des
          couleurs, taille du CTA.
        </Panel>
      </div>
    </div>
  );
}
