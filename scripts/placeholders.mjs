// Lists every fact still waiting for the owner: TBA values and unconfirmed
// claims in src/data, plus CONFIRM markers in pages. Run: npm run placeholders
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const targets = [
  { dir: 'src/data', pattern: /\bTBA\b|confirmed: false|CONFIRM/ },
  { dir: 'src/pages', pattern: /CONFIRM/ },
];

let count = 0;
for (const { dir, pattern } of targets) {
  for (const file of readdirSync(dir, { recursive: true })) {
    const path = join(dir, String(file));
    if (!/\.(ts|astro)$/.test(path) || path.endsWith('tba.ts')) continue;
    readFileSync(path, 'utf8').split('\n').forEach((line, i) => {
      if (pattern.test(line) && !/^\s*(\/\/|\*|\/\*\*|import )/.test(line)) {
        count++;
        console.log(`${path.replaceAll('\\', '/')}:${i + 1}  ${line.trim().slice(0, 110)}`);
      }
    });
  }
}
console.log(`\n${count} item(s) still need real information before launch.`);
