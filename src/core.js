import { partialRight, map, fromPairs, pipe } from 'ramda';

import fs from 'fs';
import pathUtil from 'path';

import { loader as defaultLoader } from './loader/sveltev2.js';
import { encodeContent } from './encoding.js';
import * as Dom from './dom.js';
import { hypenCaseFromPath } from './string';

const defaultOpts = {
  components: [],
  salt: 'default-salt'
};

export const resolveSources = 
  pipe(map((src) => [hypenCaseFromPath(src), src]), fromPairs);

const stylesheet = (href) => `<link rel="stylesheet" href="/${href}.css">`
const script = (src) => `<script defer="true" src="/${src}.js"></script>`

export const compile = (html, opts = defaultOpts, loader = defaultLoader) => {
  const encode = partialRight(encodeContent, [opts.salt]);
  const dom = Dom.parse(html);
  const resolveSrc = resolveSources(opts.components)
  const rendered = Dom.replaceWith(dom, loader.render, resolveSrc);
  const customElements = Dom.customElements(dom);
  
  return {
    html: Dom.serialize(rendered), 
    css: [],
    js: js.map(content => ({name: encode(content), code: content}))
  }
}

export default compile;
