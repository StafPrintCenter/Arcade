import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { WhatsAppIcon, FacebookIcon, LinkedinIcon, XIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

function shareUrl() {
  if (typeof window === "undefined") return "https://stafprint.com";
  return `${window.location.origin}`;
}

export function ShareProgress({ message, compact }: { message: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = shareUrl();
  const text = `${message} - SPC Arcade, le hub de jeux de ${SITE.name}.`;
  const e = encodeURIComponent;

  const links = [
    { name: "Facebook", icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}&quote=${e(text)}` },
    { name: "LinkedIn", icon: LinkedinIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}` },
    { name: "WhatsApp", icon: WhatsAppIcon, href: `https://wa.me/?text=${e(`${text} ${url}`)}` },
    { name: "X (Twitter)", icon: XIcon, href: `https://twitter.com/intent/tweet?text=${e(text)}&url=${e(url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible */
    }
  }

  return (
    <div className={compact ? "" : "card-arcade p-4"}>
      {!compact ? (
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Partager ma progression</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Button key={l.name} asChild variant="secondary" size="sm">
            <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Partager sur ${l.name}`}>
              <l.icon className="mr-1 size-4" /> {l.name}
            </a>
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={copy}>
          {copied ? <Check className="mr-1 size-4 text-success" /> : <Copy className="mr-1 size-4" />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </div>
    </div>
  );
}
