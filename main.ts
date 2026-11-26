import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const entry = fileURLToPath(new URL('.', import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const limits = {
  text_max_bytes: 163_840,
  screenshots: { max: 4, max_bytes: 262_144 },
  app_max_files: 993,
  app_max_bytes: 16_777_216,
};

mkdirSync(output, { recursive: true });
for (const folder of ['app', 'screenshots']) {
  cpSync(join(entry, folder), join(output, folder), { recursive: true });
}

const dossier = buildDossier(output, limits);
const destination = join(output, 'dossier.json');
writeFileSync(destination, dossier);
console.log(`Wrote ${destination} (${dossier.byteLength} bytes)`);
