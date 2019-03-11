import 'svelte/ssr/register';
import * as svelte from 'svelte';

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import Hashids from 'hashids';

import fs from 'fs';
import path from 'path';

import { nameFromPath, filenameFromPath } from './string';
import { encodeStr } from './encoding';

export const renderComponent = (src, att) => {
  const component = require(src);
  return component.render(att, {hydratable:true,css:false}).toString();
};

const dependencies = (data, filePath) => {
  var deps = new Set();
  const dir = path.dirname(filePath);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: nameFromPath(filePath),
    filename: filenameFromPath(filePath),
		format: 'es',
	};
	const compiled = svelte.compile(data, options);
  const ast = parser.parse(compiled.js.code, {sourceType: 'module'});
  traverse(ast, {
    ImportDeclaration: function(p) {
      const valuePath =  p.node.source.value.toString();
      if (valuePath.endsWith('.html')) {
        const src = path.resolve(dir, valuePath);
        const compData = fs.readFileSync(src, 'utf8');
        dependencies(compData, src).forEach((srcPath, alias) => { 
          deps.add(srcPath);
        });
        deps.add(valuePath);
      }    
    }
  });
  return deps;
}

export const compileClient = (src, att) => {
  const data = fs.readFileSync(src, 'utf8');
  const dir = path.dirname(src);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: encodeStr(src),
    filename: filenameFromPath(src),
		format: 'iife',
    globals: (relPath) => {
      const resolved = path.resolve(dir, relPath);
      return encodeStr(resolved);
    }
	};
	const compiled = svelte.compile(data, options, att);
	return compiled.js.code;
};

export const resolveDependencies = (src) => {
  const data = fs.readFileSync(src, 'utf8');
  var result = new Map();
  const deps = dependencies(data, src);
  const dir = path.dirname(src);
  for (const key of deps.keys()) {
    const resolvedPath = path.resolve(dir, key);
    result.set(encodeStr(resolvedPath), compileClient(resolvedPath, {}));
  };
  return result; 
}

const constructor = (src, params) => 
  params.map(param => `
    new ${encodeStr(src)}({
    target:document.getElementById('${param.id}'),
    hydrate:true,data:${JSON.stringify(param.attr)}}
  );`).join('')
  

export const loader = (src, att, params) => {
  var head = resolveDependencies(src);
  head.set(encodeStr(src), compileClient(src, att));
  return {
    head: head, 
    inline: renderComponent(src, att),
    end: constructor(src, params)
  };
};

export default loader;
