const svelte = require('svelte');
import * as R from 'ramda';
import { readFileSync } from 'fs';
import  pathUtil from 'path';
import { walk } from 'estree-walker';
const acorn = require('acorn');

export const render = (src, attr) => {
  require('svelte/ssr/register');
  const component = require(src);
  return require(src).render(attr).html
}

export const client = (src, globals) => {
  const comp = readFileSync(src, 'utf8');
  const dir = pathUtil.dirname(src);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: globals[src],
    filename: src,
		format: 'iife',
    globals: (relPath) => globals[relPath]
	};
	return svelte.compile(comp, options).js.code;
}

export const style = (src) => {
  const data = readFileSync(src, 'utf8');
	const options = {
		generate: 'dom',
		css: true,	
		format: 'cjs'
	};
	return svelte.compile(data, options).css.code;
}

export const constructor = (name, id, attr) => 
  `new ${name}({target:document.getElementById('${id}'),hydrate:true,data:${JSON.stringify(attr)}});`;

export const name = 'SvelteV2';

export const isComponent = (src) => src.endsWith('.html');

export const isLogic = (src) => !isComponent(src);
