import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SITE, SITE_LINK } from "@/data/site";

const TITLE = `CGU & Confidentialité - ${SITE.tool} | ${SITE.name}`;
const DESC = `Conditions générales d'utilisation et politique de confidentialité de ${SITE.tool}, le hub de jeux de ${SITE.name}.`;

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CguPage,
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Objet",
    body: [
      `${SITE.tool} est un hub de jeux pédagogiques édité par ${SITE.name} (${SITE.tool}). Les présentes conditions encadrent l'utilisation du site ${SITE_LINK.arcadeUrl}. En jouant, vous les acceptez.`,
    ],
  },
  {
    title: "2. Accès au service",
    body: [
      "L'accès est gratuit et ne nécessite aucun compte. Le service peut être modifié, suspendu ou interrompu à tout moment, sans préavis.",
    ],
  },
  {
    title: "3. Données personnelles",
    body: [
      `Aucune donnée personnelle n'est collectée par ${SITE.name}. Votre pseudo, ville, avatar, scores, XP et badges sont enregistrés uniquement dans le stockage local de votre navigateur.",
      "Vider le cache ou changer d'appareil efface définitivement votre progression. Aucun autre joueur ne peut voir vos scores : le classement est strictement local.`,
    ],
  },
  {
    title: "4. Partage volontaire",
    body: [
      "Vous pouvez partager votre progression sur Facebook, LinkedIn, WhatsApp ou X. Ce partage est toujours déclenché par vous ; les données transmises sont alors soumises aux règles de ces plateformes.",
    ],
  },
  {
    title: "5. Publicités et cookies",
    body: [
      "Le site affiche des annonces fournies par Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur vos visites sur ce site et d'autres sites.",
      "Vous pouvez désactiver la publicité personnalisée dans les paramètres des annonces Google (adssettings.google.com). Plus d'informations : policies.google.com/technologies/ads.",
    ],
  },
  {
    title: "6. Pass Zéro Pub (FedaPay)",
    body: [
      `Le Pass Zéro Pub supprime les publicités pendant 7 jours sur le navigateur où il est activé. Le paiement est traité par FedaPay ; ${SITE.name} ne reçoit ni ne conserve vos informations de paiement.",
      "Le pass est lié au navigateur (non transférable entre appareils) et non remboursable une fois activé. Le code de secours est personnel : son partage est interdit.`,
    ],
  },
  {
    title: "7. Contenu des jeux",
    body: [
      "Les jeux sont pédagogiques et fictifs. Les briefs, clients et logos présentés sont imaginaires ; toute ressemblance avec une marque existante serait fortuite.",
    ],
  },
  {
    title: "8. Propriété intellectuelle",
    body: [
      `La marque ${SITE.name}, le nom ${SITE.tool}, les jeux, textes et visuels sont protégés. Toute reproduction sans autorisation est interdite.`,
    ],
  },
  {
    title: "9. Responsabilité",
    body: [
      `Le service est fourni « en l'état ». ${SITE.name} ne saurait être tenu responsable d'une perte de progression, d'une indisponibilité ou du contenu des annonces tierces.`,
    ],
  },
  {
    title: "10. Contact",
    body: [`Pour toute question : ${SITE.name}, Porto-Novo, Bénin — via stafprint.com.`],
  },
];

function CguPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Retour au hub
      </Link>
      <h1 className="mt-4 font-display text-3xl sm:text-4xl">CGU & Confidentialité</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : octobre 2026</p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title} className="card-arcade p-5">
            <h2 className="font-display text-xl">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
