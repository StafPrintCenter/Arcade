import { useState } from "react";
import { Briefcase, Cpu, Users } from "lucide-react";
import { Panel, Stat, type GameProps } from "../game-kit";
import { Button } from "@/components/ui/button";
import { formatFCFA } from "@/lib/arcade/data";

type Role = "graphiste" | "dev" | "operateur";

interface Contract {
  id: string;
  client: string;
  title: string;
  role: Role;
  days: number;
  pay: number;
  rep: number;
}

const ROLE_LABEL: Record<Role, string> = {
  graphiste: "Graphiste",
  dev: "Développeur Web",
  operateur: "Opérateur Impression",
};

const POOL: Omit<Contract, "id">[] = [
  { client: "Pharmacie Ouando", title: "Enseigne lumineuse LED", role: "operateur", days: 5, pay: 450000, rep: 8 },
  { client: "Lycée Béhanzin", title: "1 000 badges scolaires", role: "operateur", days: 3, pay: 180000, rep: 5 },
  { client: "Zinsou Boutique", title: "Site e-commerce vitrine", role: "dev", days: 7, pay: 850000, rep: 12 },
  { client: "Transport Adjarra", title: "Habillage véhicule complet", role: "operateur", days: 6, pay: 620000, rep: 10 },
  { client: "Café Tokpa", title: "Identité visuelle + logo", role: "graphiste", days: 4, pay: 300000, rep: 7 },
  { client: "ONG Sourire", title: "Kit affiches campagne", role: "graphiste", days: 3, pay: 210000, rep: 6 },
  { client: "Startup Fintech", title: "Landing page + dashboard", role: "dev", days: 5, pay: 700000, rep: 9 },
  { client: "Mairie de Porto-Novo", title: "Signalétique urbaine", role: "operateur", days: 8, pay: 980000, rep: 14 },
  { client: "Restaurant Le Wharf", title: "Menus pelliculés + set de table", role: "graphiste", days: 2, pay: 150000, rep: 4 },
];

const TOTAL_DAYS = 30;

function drawOffers(day: number): Contract[] {
  return [0, 1, 2].map((k) => {
    const base = POOL[(day * 3 + k * 5) % POOL.length]!;
    return { ...base, id: `${day}-${k}` };
  });
}

interface ActiveJob extends Contract {
  remaining: number;
}

export function StudioManager({ profile, setScore, setStatus, onFinish }: GameProps) {
  const [day, setDay] = useState(1);
  const [cash, setCash] = useState(500000);
  const [reputation, setReputation] = useState(40);
  const [revenue, setRevenue] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [staff, setStaff] = useState<Record<Role, number>>({ graphiste: 1, dev: 1, operateur: 1 });
  const [jobs, setJobs] = useState<ActiveJob[]>([]);
  const [offers, setOffers] = useState<Contract[]>(() => drawOffers(1));
  const [log, setLog] = useState<string[]>(["Jour 1 — L'agence ouvre ses portes."]);

  const busy = (role: Role) => jobs.filter((j) => j.role === role).length;
  const pushLog = (msg: string) => setLog((l) => [msg, ...l].slice(0, 8));

  function accept(c: Contract) {
    if (busy(c.role) >= staff[c.role]) {
      pushLog(`Aucun ${ROLE_LABEL[c.role]} disponible pour « ${c.title} ».`);
      return;
    }
    setJobs((j) => [...j, { ...c, remaining: Math.max(1, Math.ceil(c.days / speed)) }]);
    setOffers((o) => o.filter((x) => x.id !== c.id));
    pushLog(`Contrat accepté : ${c.client} — ${c.title}.`);
  }

  function hire(role: Role) {
    const cost = 250000;
    if (cash < cost) return pushLog("Trésorerie insuffisante pour recruter.");
    setCash((c) => c - cost);
    setStaff((s) => ({ ...s, [role]: s[role] + 1 }));
    pushLog(`Recrutement d'un ${ROLE_LABEL[role]}.`);
  }

  function upgrade() {
    const cost = 600000;
    if (cash < cost) return pushLog("Trésorerie insuffisante pour la nouvelle machine.");
    setCash((c) => c - cost);
    setSpeed((s) => Math.min(2.5, s + 0.5));
    pushLog("Nouvelle machine installée : production accélérée.");
  }

  function endGame(finalRep: number, finalRevenue: number, finalCash: number) {
    const score = Math.round(finalRep * 40 + finalRevenue / 1000 + finalCash / 2000);
    const xp = Math.round(score / 6);
    const badges: string[] = [];
    if (finalRep >= 80) badges.push("directeur-agence");
    if (finalRevenue >= 2000000) badges.push("millionnaire");
    onFinish({
      score,
      xp,
      victory: finalRep >= 55 && finalCash > 0,
      label: `Réputation ${finalRep} • ${formatFCFA(finalRevenue)}`,
      newRecord: finalRep > profile.gamesData.studioManager.maxReputation,
      badges,
      patch: {
        studioManager: {
          maxReputation: Math.max(finalRep, profile.gamesData.studioManager.maxReputation),
          totalRevenue: profile.gamesData.studioManager.totalRevenue + finalRevenue,
          bestRunDays: Math.max(TOTAL_DAYS, profile.gamesData.studioManager.bestRunDays),
        },
      },
    });
  }

  function nextDay() {
    let nCash = cash - 45000; // charges quotidiennes
    let nRep = reputation;
    let nRevenue = revenue;

    const updated: ActiveJob[] = [];
    for (const j of jobs) {
      const remaining = j.remaining - 1;
      if (remaining <= 0) {
        nCash += j.pay;
        nRevenue += j.pay;
        nRep = Math.min(100, nRep + j.rep);
        pushLog(`Livraison réussie : ${j.client} (+${formatFCFA(j.pay)}, +${j.rep} rép.)`);
      } else {
        updated.push({ ...j, remaining });
      }
    }

    if (jobs.length === 0) {
      nRep = Math.max(0, nRep - 1);
    }
    if (nCash < 0) nRep = Math.max(0, nRep - 3);

    const nDay = day + 1;
    setJobs(updated);
    setCash(nCash);
    setRevenue(nRevenue);
    setReputation(nRep);
    setScore(Math.round(nRep * 40 + nRevenue / 1000 + Math.max(0, nCash) / 2000));
    setStatus(`Jour ${Math.min(nDay, TOTAL_DAYS)}/${TOTAL_DAYS}`);

    if (nDay > TOTAL_DAYS) {
      endGame(nRep, nRevenue, nCash);
      return;
    }
    setDay(nDay);
    setOffers(drawOffers(nDay));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <Panel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Jour" value={`${day}/${TOTAL_DAYS}`} />
            <Stat label="Trésorerie" value={formatFCFA(cash)} tone={cash < 0 ? "rare" : "success"} />
            <Stat label="Réputation" value={`${reputation}/100`} tone="primary" />
            <Stat label="CA cumulé" value={formatFCFA(revenue)} tone="rare" />
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="size-4" />
            <span className="text-xs uppercase tracking-[0.18em]">Appels d'offres du jour</span>
          </div>
          <div className="mt-3 space-y-2">
            {offers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tous les contrats du jour ont été traités.</p>
            ) : null}
            {offers.map((c) => {
              const free = staff[c.role] - busy(c.role);
              return (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.client} • {ROLE_LABEL[c.role]} • {Math.max(1, Math.ceil(c.days / speed))} j • +{c.rep} rép.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm text-primary">{formatFCFA(c.pay)}</span>
                    <Button size="sm" disabled={free <= 0} onClick={() => accept(c)}>
                      {free > 0 ? "Accepter" : "Équipe occupée"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Button className="mt-4 w-full" onClick={nextDay}>
            Passer au jour suivant
          </Button>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel>
          <div className="flex items-center gap-2 text-primary">
            <Users className="size-4" />
            <span className="text-xs uppercase tracking-[0.18em]">Équipe & ressources</span>
          </div>
          <div className="mt-3 space-y-2">
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <div key={r} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm">
                <span>
                  {ROLE_LABEL[r]} — {staff[r] - busy(r)}/{staff[r]} libre(s)
                </span>
                <Button size="sm" variant="secondary" onClick={() => hire(r)}>
                  Recruter (250 000)
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm">
              <span className="flex items-center gap-2">
                <Cpu className="size-4 text-primary" /> Cadence ×{speed.toFixed(1)}
              </span>
              <Button size="sm" variant="secondary" onClick={upgrade}>
                Machine (600 000)
              </Button>
            </div>
          </div>
        </Panel>

        <Panel>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Production en cours</p>
          <div className="mt-3 space-y-2">
            {jobs.length === 0 ? <p className="text-sm text-muted-foreground">Atelier au repos.</p> : null}
            {jobs.map((j) => (
              <div key={j.id} className="rounded-xl border border-border bg-background/40 px-3 py-2 text-sm">
                <p>{j.title}</p>
                <p className="text-xs text-muted-foreground">
                  {ROLE_LABEL[j.role]} • livraison dans {j.remaining} j
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Journal d'agence</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {log.map((l, i) => (
              <p key={`${l}-${i}`}>• {l}</p>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}