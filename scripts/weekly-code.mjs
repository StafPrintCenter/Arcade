// Affiche le code Zéro Pub de cette semaine et des 4 suivantes.
// Usage : node scripts/weekly-code.mjs
// Le SALT doit être identique à VITE_VIP_SALT (ou à la valeur par défaut de src/lib/arcade/ads.ts).
const SALT = process.env.VITE_VIP_SALT || "STAF-PRINT-PORTO-NOVO";

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const ys = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return { year: d.getUTCFullYear(), week: Math.ceil(((d - ys) / 86400000 + 1) / 7) };
}
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36).toUpperCase().padStart(4, "0").slice(-4);
}
for (let i = 0; i < 5; i++) {
  const date = new Date(Date.now() + i * 7 * 86400000);
  const { year, week } = isoWeek(date);
  const code = `SPC-W${String(week).padStart(2, "0")}-${hash(`${SALT}|${year}|${week}`)}`;
  console.log(`${i === 0 ? "Cette semaine" : `+${i} sem.`}  ${year} S${week}  →  ${code}`);
}
