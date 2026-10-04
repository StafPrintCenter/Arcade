import { useCallback, useEffect, useState } from "react";

export const ADSENSE_CLIENT = "ca-pub-9682293308540812";
/** Ad unit slot IDs from AdSense ("Annonces > Par bloc d'annonces"). Empty = branded placeholder. */
export const ADSENSE_SLOTS = {
  interstitial: (import.meta.env['VITE_ADSENSE_SLOT_INTERSTITIAL'] as string | undefined) ?? "",
  result: (import.meta.env['VITE_ADSENSE_SLOT_RESULT'] as string | undefined) ?? "",
};
export const FEDAPAY_URL = "https://me.fedapay.com/spc-stop-aracde-pub";
export const PASS_DURATION_MS = 7 * 24 * 3600 * 1000;

const RETURN_TOKEN = (import.meta.env['VITE_FEDAPAY_RETURN_TOKEN'] as string | undefined) ?? "";
const SALT = (import.meta.env['VITE_VIP_SALT'] as string | undefined) ?? "";
const KEY = "spc_arcade_ad_free_until";
const EVT = "spc-ad-free-change";

/** ISO week number (Monday start). */
export function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).toUpperCase().padStart(4, "0").slice(-4);
}

/** Weekly code, e.g. SPC-W41-7KQ2. Changes automatically every Monday. */
export function weeklyCode(date = new Date()) {
  const { year, week } = isoWeek(date);
  return `SPC-W${String(week).padStart(2, "0")}-${hash(`${SALT}|${year}|${week}`)}`;
}

/** Accepts this week's code and last week's (grace for Monday purchases). */
export function isValidCode(input: string) {
  const c = input.trim().toUpperCase().replace(/\s+/g, "");
  const lastWeek = new Date(Date.now() - 7 * 86400000);
  return c === weeklyCode() || c === weeklyCode(lastWeek);
}

export function isValidReturnToken(token: string | null) {
  // Exige que RETURN_TOKEN soit bien défini dans l'environnement ET corresponde au jeton fourni
  return Boolean(token && RETURN_TOKEN && token === RETURN_TOKEN);
}


export function activatePass() {
  const until = Date.now() + PASS_DURATION_MS;
  localStorage.setItem(KEY, String(until));
  window.dispatchEvent(new Event(EVT));
  return until;
}

function readUntil() {
  const v = Number(localStorage.getItem(KEY) || 0);
  return v > Date.now() ? v : 0;
}

export function useAdFree() {
  const [until, setUntil] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setUntil(readUntil());
    sync();
    setReady(true);
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const activate = useCallback(() => setUntil(activatePass()), []);
  return { adFree: until > 0, until, ready, activate };
}

export function formatRemaining(until: number) {
  const ms = Math.max(0, until - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return d > 0 ? `${d}j ${h}h` : `${h}h`;
}
