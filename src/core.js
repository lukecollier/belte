import { partialRight, map, fromPairs, pipe, flatten, uniq, assoc, reduce, zipWith, keys, reverse } from 'ramda';

import fs from 'fs';
import util from 'util';
import pathUtil from 'path';

import { encodeForFileName } from './encoding';
import { resolve, imports } from './dependency';
import * as DOM from './dom';
import { hypenCaseFromPath, filenameFromPath } from './string';

import * as rollup from 'rollup';
import sucrase from 'rollup-plugin-sucrase';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import * as filesize from 'filesize';

const defaultOpts = {
  components: [],
  salt: 'default-salt'
};

export function aliasFromSource(src) {
  const filename = filenameFromPath(src);
  if (filename === 'index.js') {
    const index = src.lastIndexOf('/index.js');
    const slash = src.substring(0,index).lastIndexOf('/');
    return src.substring(slash+1, index);
  } else {
    return src;
  }
}

export async function compileChunk(src, external, globals, name) {
  const inputOptions = {
    input: src,
    external: (_) => external,
    treeshake: true,
    plugins: [ 
      commonjs(({ include: 'node_modules/**' })),
      nodeResolve(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['jsx']
      })
    ],
  }
  const outputOptions = {
    sourcemap: false, // should depend on if it's prod or not and be named accordingly
    format: 'iife',
    banner: `var process = {env: {NODE_ENV: "${process.env.NODE_ENV}"}};`, // todo replace this with a permenent solution
    name: name,
    globals: globals,
    file: src,
  }
  return rollup.rollup(inputOptions)
    .then((bundle) => bundle.generate(outputOptions))
    .then((value) => value.output[0].code);
}

export const resolveSources = 
  pipe(map((src) => [hypenCaseFromPath(src), src]), fromPairs);

const stylesheet = (href) => `<link rel="stylesheet" href="/${href}.css">`
const script = (src) => `<script defer="true" src="/${src}.js"></script>`

export async function compile(html, opts = defaultOpts, loader) {
  const dom = DOM.parse(html);
  const resolveSrc = resolveSources(opts.components)

  const sources = pipe(map((el) => resolve(resolveSrc[el.name], loader.isComponent)), flatten, uniq,reverse)(DOM.customElements(dom)); 
  const contents = map(util.promisify(fs.readFile), sources);

  const otherSources = map(({src})=>src, map((src) => imports(src, loader.isLogic), sources).flat());
  const otherContents = map(util.promisify(fs.readFile), otherSources);

  const encodeFile = partialRight(encodeForFileName, [opts.salt]);

  const raw = zipWith((content, src) => ({
    alias: aliasFromSource(src), id: 'BelteComponent' + encodeFile(content), src}),
    await Promise.all(contents), sources);
  const otherRaw = zipWith((content, src) => ({
    alias: aliasFromSource(src), id: 'BelteLogic' + encodeFile(content), src}),
    await Promise.all(otherContents), otherSources);

  const globals = reduce((acc, {alias, id}) => assoc(alias, id, acc), {}, [...raw, ...otherRaw]);

  const compsFiles = map(({src, id}) => compileChunk(src, true, globals, id), raw).flat();
  const nonCompsFiles = map(({src, id}) => compileChunk(src, false, globals, id), otherRaw).flat();

  const scriptsObj = map((content) => 
    ({ name: 'BelteLogic.' + encodeFile(Buffer.from(content)), 
      code: content.toString('utf8') }), 
    await Promise.all(nonCompsFiles)).flat();
  const componentsObj = map((content) => 
    ({ name: `${loader.name}.${encodeFile(Buffer.from(content))}`, 
      code: loader.client(content,globals) }), 
    await Promise.all(compsFiles)).flat()

  // todo make this more concise and pull multiple construcotrs into the same script
  const sourceMap = reduce((acc, {src, id}) => assoc(src, id, acc), {}, [...raw, ...otherRaw]);
  const constructors = map((el) => assoc('name', sourceMap[resolveSrc[el.name]], el), DOM.customElements(dom));
  const constructorsObj = map(({id, attr, name}) => ({
    name: encodeFile(Buffer.from(loader.constructor(name, id, attr, globals))), 
    code: loader.constructor(name, id, attr, globals)}), constructors);

  const result = reduce((acc, {name, code}) => assoc(name, code, acc), {}, 
    [...scriptsObj, ...componentsObj, ...constructorsObj]);

  const rendered = DOM.replaceWith(dom, loader.render, resolveSrc);
  const headUpdated = DOM.appendToHead(rendered, map(script, keys(result)))
  return {
    html: DOM.serialize(headUpdated), 
    css: [],
    assets: [], // new api should use assets {type: css | js | img, filename: '', code: ''
    js: result
  }
}

export default compile;
