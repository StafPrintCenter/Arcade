import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ArcadeShell } from "@/components/site";
import { SITE, SITE_LINK } from "@/data/site";
import { stripProtocol } from "@/lib/domain";

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

type SectionItem = {
  title: string;
  body: (string | React.ReactNode)[];
};

const SECTIONS: SectionItem[] = [
  {
    title: "1. Objet",
    body: [
      <>
        {SITE.tool} est un hub de jeux pédagogiques édité par {SITE.name}. Les
        présentes conditions encadrent l'utilisation du site{" "}
        <a
          href={SITE_LINK.arcadeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          {stripProtocol(SITE_LINK.arcadeUrl)}
        </a>
        . En jouant, vous les acceptez.
      </>,
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
      `Aucune donnée personnelle n'est collectée par ${SITE.name}. Votre pseudo, ville, avatar, scores, XP et badges sont enregistrés uniquement dans le stockage local de votre navigateur. Vider le cache ou changer d'appareil efface définitivement votre progression. Aucun autre joueur ne peut voir vos scores. Le classement est strictly local.`,
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
      <>
        Vous pouvez désactiver la publicité personnalisée dans les{" "}
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          paramètres des annonces Google
        </a>
        . Plus d'informations :{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          policies.google.com/technologies/ads
        </a>
        .
      </>,
    ],
  },
  {
    title: "6. Pass Zéro Pub (FedaPay)",
    body: [
      `Le Pass Zéro Pub supprime les publicités pendant 7 jours sur le navigateur où il est activé. Le paiement est traité par FedaPay ; ${SITE.name} ne reçoit ni ne conserve vos informations de paiement.`,
      "Le pass est lié au navigateur (non transférable entre appareils) et non remboursable une fois activé. Le code de secours est personnel : son partage est interdit.",
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
    <ArcadeShell>
      <div className="container max-w-4xl py-8 px-4 mx-auto">
        <Link className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" to="/">
          <ArrowLeft className="h-4 w-4" />
          Retour au hub
        </Link>

        <h1 className="text-3xl font-bold mb-2">CGU & Confidentialité</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Dernière mise à jour : octobre 2026
        </p>

        <div className="space-y-8">
          {SECTIONS.map((s, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-xl font-semibold">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </ArcadeShell>
  );
}
