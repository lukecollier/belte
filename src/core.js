import * as fg from 'fast-glob';
import * as R from 'ramda';

import fs from 'fs';
import path from 'path';

import { loader as defaultLoader, makeRender } from './loader/svelte.js';
import { hyphenCaseToTitleCase, nameFromPath } from './string.js';
import { encodeContent } from './encoding.js';
import { domRefs, appendToHead, parse, serialize } from './dom.js';

const defaultOpts = {
  source: 'src/**/*.html',
  salt: 'default-salt'
};

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
  resolvers.Default = (_) => '<belte-error></betle-error>';
  return resolvers;
}

export const compile = (html, opts = defaultOpts, loader = defaultLoader) => {
  const encode = R.partialRight(encodeContent, [opts.salt])
  const dom = parse(html);
  const refs = domRefs(dom, resolversFromGlob(opts.source));
  const sources = validSrc(opts.source);
  var headElements = new Set();
  var stylesAcc = new Set();
  var scriptsAcc = new Set();
  refs.forEach((instances, name, _) => {
    console.log(process.cwd(), sources.get(name));
    const src = path.resolve(process.cwd(), sources.get(name));
    const { scripts, styles } = loader(src, instances);
    styles.forEach(css => {
      stylesAcc.add(css);
      headElements.add(`<link rel="stylesheet" href="/${encode(css, 'Svelte.')}.css">`);
    });

    scripts.forEach(script => {
      scriptsAcc.add(script);
      headElements.add(`<script defer="true" src="/${encode(script, 'Svelte.')}.js"></script>`);
    });
  });
  appendToHead(dom, headElements);
  return {
    html: serialize(dom), 
    css: Array.from(stylesAcc).map(content => { 
      return { name: encode(content, 'Svelte.'), code: content}
    }), 
    js: Array.from(scriptsAcc).map(content => { 
      return { name: encode(content, 'Svelte.'), code: content}
    })
  };
};

export default compile;
