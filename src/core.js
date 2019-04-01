import * as R from 'ramda';

import fs from 'fs';
import pathUtil from 'path';

import { loader as defaultLoader } from './loader/sveltev2.js';
import { nameFromPath } from './string.js';
import { encodeContent } from './encoding.js';
import { domRefs, appendToHead, parse, serialize } from './dom.js';

const defaultOpts = {
  components: [],
  salt: 'default-salt'
};

export const allLoaders = (componentPaths, partialLoader, encode) => {
  return new Map(componentPaths.map(path => {
    const src = pathUtil.resolve(process.cwd(), path);  
    return [ nameFromPath(path), partialLoader(src, encode) ];
  }));
}

const stylesheet = (href) => `<link rel="stylesheet" href="/${href}.css">`
const script = (src) => `<script defer="true" src="/${src}.js"></script>`

export const compile = (html, opts = defaultOpts, loader = defaultLoader) => {
  const encode = R.partialRight(encodeContent, [opts.salt]);
  const dom = parse(html);
  const loaders = allLoaders(opts.components, loader, encode);
  const refs = domRefs(dom, htmlResolversFromLoaders(loaders));
  
  const js = [...refs.entries()].map(([name, ...instances]) => {
    const constructors = instances.flat()
      .map(instance => loaders.get(name).constructor(instance.id, instance.attr));
    const deps = loaders.get(name).dependencies()
      .map(dep=>loaders.get(nameFromPath(dep)).client());
    const result = [...deps, loaders.get(name).client(), ...constructors];
    result.forEach(content => appendToHead(dom, [script(encode(content))]));
    return result;
  }).flat(); 


  return {
    html: serialize(dom), 
    css: [],
    js: js.map(content => ({name: encode(content), code: content}))
  };
}

export default compile;
