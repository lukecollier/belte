import * as fg from 'fast-glob';

import fs from 'fs';
import path from 'path';

import { loader as defaultLoader, makeRender } from './loader/svelte.js';
import { hyphenCaseToTitleCase, nameFromPath } from './string.js';
import { encodeContentForFilename } from './encoding.js';
import { domRefs, appendToHead, parse, serialize } from './dom.js';

const defaultOpts = {
  target: './build/index.html',
  source: '__tests__/resource/svelte/**.html'
};

const write = (target, data) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
}

export const componentsPaths = (componentNames, glob) => {
  const entries = fg.sync([glob]);
  var foundPaths = [];
  entries.forEach(path => {
    const name = nameFromPath(path)
    if (componentNames.includes(name)) {
      foundPaths.push(path);
    }
  });
  return foundPaths;
}

export const validSrc = (glob) => {
  const entries = fg.sync([glob]);
  var sources = new Map();
  entries.forEach(path => sources.set(nameFromPath(path), path));
  return sources;
}

export const resolversFromGlob = (glob) => {
  const entries = fg.sync([glob]);
  let resolvers = {};
  entries.forEach(path => {
    const name = nameFromPath(path)
    resolvers[name] = makeRender(path);
  });
  return resolvers;
}

export const compile = (html, opts = defaultOpts, loader = defaultLoader) => {
  const dom = parse(html);
  const refs = domRefs(dom, resolversFromGlob(opts.source));
  const sources = validSrc(opts.source);
  var headElements = new Set();
  var stylesAcc = new Set();
  var scriptsAcc = new Set();
  refs.forEach((instances, name, _) => {
    const src = path.resolve(process.cwd(), sources.get(name));
    const { scripts, styles } = loader(src, instances);
    styles.forEach(css => {
      const resolved = path.resolve(process.cwd(), './build/' + encodeContentForFilename(css) + '.css');
      // write(resolved, css);
      stylesAcc.add(css);
      headElements.add(`<link rel="stylesheet" href="/${encodeContentForFilename(css)}.css">`);
    });

    scripts.forEach(script => {
      const resolved = path.resolve(process.cwd(), './build/' + encodeContentForFilename(script) + '.js');
      // write(resolved, script);
      scriptsAcc.add(script);
      headElements.add(`<script defer="true" src="/${encodeContentForFilename(script)}.js"></script>`);
    });
  });
  appendToHead(dom, headElements);
  const target = path.resolve(process.cwd(), opts.target);
  write(target, serialize(dom));
  return {
    html: serialize(dom), 
    css: Array.from(stylesAcc).map(content=>{ 
      return { name: encodeContentForFilename(content) + '.css', code: content}
    }), 
    js: Array.from(scriptsAcc).map(content=>{ 
      return { name: encodeContentForFilename(content) + '.js', code: content}
    })
  };
};

export default compile;
