// Runs inside GitHub Actions: append today's busuanzi totals to data/traffic-history.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'data/traffic-history.json';
const res = await fetch('https://busuanzi.ibruce.info/busuanzi?jsonpCallback=cb', {
  headers: { referer: 'https://hrjtju.github.io/', 'user-agent': 'Mozilla/5.0' },
});
if (!res.ok) { console.log('HTTP', res.status); process.exit(2); }
const text = await res.text();
const m = text.match(/\(\s*(\{[\s\S]*?\})\s*\)/);
if (!m) { console.log('NO_JSON'); process.exit(3); }
const data = JSON.parse(m[1]);
const today = new Date().toISOString().slice(0, 10);
const history = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { days: [] };
const days = Array.isArray(history.days) ? history.days : [];
const entry = { date: today, site_pv: data.site_pv, site_uv: data.site_uv };
const idx = days.findIndex((d) => d.date === today);
if (idx >= 0) days[idx] = entry; else days.push(entry);
days.sort((a, b) => (a.date < b.date ? -1 : 1));
writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), days }, null, 1));
console.log('snapshot', today, 'pv', data.site_pv, 'uv', data.site_uv, 'days', days.length);
