import * as esbuild from 'esbuild';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

const options = {
  entryPoints: ['src/card.js'],
  outfile: 'dist/bugsa-solar-card.js',
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['chrome111', 'safari16.4', 'firefox113'],
  define: { __VERSION__: JSON.stringify(version) },
  legalComments: 'none',
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  await (await esbuild.context(options)).watch();
} else {
  await esbuild.build(options);
}
