import esbuild from 'esbuild';

const commonConfig = {
  entryPoints: ['src/index.ts'],
  platform: 'node',
  minify: true,
  bundle: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  legalComments: "inline",
  target: ['node18', 'es2022'],
};

// Async function to run builds
async function build() {
  try {
    // Build CommonJS
    await esbuild.build({
      ...commonConfig,
      format: 'cjs',
      outfile: 'dist/index.cjs.js',
    });

    // Build ESM
    await esbuild.build({
      ...commonConfig,
      format: 'esm',
      outfile: 'dist/index.esm.js',
    });

    console.log("✅ Build completed successfully.");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Run the build function
build();
