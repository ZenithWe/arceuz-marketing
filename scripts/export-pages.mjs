import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const appURL = 'https://arceuz-marketing.contamateusfortnite.chatgpt.site';
const basePath = '/arceuz-marketing/';
let page = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
page = page.replace("import { assistantEnabled } from '@/lib/assistant-model';", 'const assistantEnabled = () => false;')
  .replace("from './public-experience'", "from '../app/public-experience'")
  .replaceAll('href="/entrar"', `href="${appURL}/entrar"`)
  .replaceAll('href="/"', `href="${basePath}"`)
  .replaceAll('src="/arceuz-logo.png"', `src="${basePath}arceuz-logo.png"`);
fs.writeFileSync(path.join(root, 'pages-site/generated-home.tsx'), page);

await build({
  configFile: false,
  root: path.join(root, 'pages-site'),
  base: basePath,
  plugins: [react()],
  publicDir: path.join(root, 'public'),
  resolve: { alias: { '@': root } },
  css: { postcss: root },
  build: { outDir: path.join(root, 'docs'), emptyOutDir: true },
});

const modules = new Map();
function sourceModule(file) {
  file = path.resolve(file);
  if (modules.has(file)) return modules.get(file).exports;
  const module = { exports: {} }; modules.set(file, module);
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  }}).outputText;
  function resolveModule(id) {
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const resolved = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(file), id);
    const target = [resolved, resolved+'.tsx', resolved+'.ts'].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!target) throw new Error(`Module missing: ${id}`);
    return sourceModule(target);
  }
  new Function('require', 'module', 'exports', compiled)(resolveModule, module, module.exports);
  return module.exports;
}
const Page = sourceModule(path.join(root, 'pages-site/generated-home.tsx')).default;
const markup = renderToString(React.createElement(Page));
const index = path.join(root, 'docs/index.html');
fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('<div id="root"></div>', `<div id="root">${markup}</div>`));
fs.writeFileSync(path.join(root, 'docs/.nojekyll'), '');
if (fs.readFileSync(index, 'utf8').includes('href="/entrar"')) throw new Error('Unexpected local login link');
console.log('GitHub Pages export ready: docs/index.html. Login and data stay on the protected hosted app.');
