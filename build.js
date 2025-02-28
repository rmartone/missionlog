const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  format: 'cjs',
  outfile: 'dist/index.cjs.js',
  platform: 'node',
  bundle: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
}).catch(() => process.exit(1));

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  format: 'esm',
  outfile: 'dist/index.esm.js',
  platform: 'node',
  bundle: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
}).catch(() => process.exit(1));
