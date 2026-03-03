// This script generates TypeScript types from OpenAPI YAML specs.
// Run with: node scripts/codegen.mjs
import openapiTS, { astToString } from 'openapi-typescript';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { resolve, basename, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

const SPECS_DIR = join(root, 'packages/infra/modules/api_gateway/openapi');
const OUTPUT_DIRS = [
  join(root, 'packages/web/src/types/generated'),
  join(root, 'packages/lambdas/libs/types/generated'),
];

const HEADER = '// This file was auto-generated from OpenAPI specs. Do not edit manually.\n\n';

async function generateTypes(specPath) {
  const ast = await openapiTS(new URL(`file://${specPath}`));
  return HEADER + astToString(ast);
}

async function run() {
  const specFiles = (await readdir(SPECS_DIR)).filter((f) => f.endsWith('.yml'));

  for (const outputDir of OUTPUT_DIRS) {
    await mkdir(outputDir, { recursive: true });
  }

  const specNames = [];

  for (const specFile of specFiles) {
    const specPath = join(SPECS_DIR, specFile);
    const name = basename(specFile, '.yml');
    specNames.push(name);

    const content = await generateTypes(specPath);

    for (const outputDir of OUTPUT_DIRS) {
      const outPath = join(outputDir, `${name}.ts`);
      await writeFile(outPath, content, 'utf8');
      console.log(`Generated: ${outPath}`);
    }
  }

  const toPascalCase = (s) =>
    s
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');

  const barrel =
    HEADER +
    specNames.map((n) => `export * as ${toPascalCase(n)} from './${n}';`).join('\n') +
    '\n';
  for (const outputDir of OUTPUT_DIRS) {
    await writeFile(join(outputDir, 'index.ts'), barrel, 'utf8');
    console.log(`Generated: ${join(outputDir, 'index.ts')}`);
  }

  console.log(`\nGenerated ${specNames.length} spec(s) into ${OUTPUT_DIRS.length} location(s).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
