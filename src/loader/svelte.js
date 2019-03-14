import 'svelte/ssr/register';
// import * as svelte from 'svelte';
const svelte = require('svelte');
const traverse = require('@babel/traverse'); // problem having to import using require
import * as parser from '@babel/parser';
import * as t from '@babel/types';
import Hashids from 'hashids';

import fs from 'fs';
import path from 'path';

import { nameFromPath, filenameFromPath } from '../string.js';
import { encodeContentForName } from '../encoding.js';

const dependencies = (data, filePath) => {
  var deps = new Set();
  const dir = path.dirname(filePath);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: nameFromPath(filePath),
    filename: filenameFromPath(filePath),
		format: 'es'
	};
	const compiled = svelte.compile(data, options);
  const ast = parser.parse(compiled.js.code, {sourceType: 'module'});
  traverse(ast, {
    ImportDeclaration: (p) => {
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

export const compileClient = (src) => {
  const compData = fs.readFileSync(src, 'utf8');
  const dir = path.dirname(src);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: encodeContentForName(compData),
    filename: filenameFromPath(src),
		format: 'iife',
    globals: (relPath) => {
      const resolved = path.resolve(dir, relPath);
      const data = fs.readFileSync(resolved, 'utf8');
      return encodeContentForName(data);
    }
	};
	const compiled = svelte.compile(compData, options);
	return compiled;
};

export const resolveDependencies = (src) => {
  const data = fs.readFileSync(src, 'utf8');
  var result = new Set();
  const deps = dependencies(data, src);
  const dir = path.dirname(src);
  for (const key of deps.keys()) {
    const resolvedPath = path.resolve(dir, key);
    const {js, css} = compileClient(resolvedPath);
    result.add({js: js.code, css: css.code});
  };
  
  return Array.from(result); 
}

const constructor = (constructorName, instances) => 
  instances.map(instance => `new ${constructorName}({target:document.getElementById('${instance.id}'),hydrate:true,data:${JSON.stringify(instance.attr)}});`).join('');
  

export const loader = (src, instances = [{id: '', attr: {}}]) => {
  const component = require(src);
  const hooks = instances.map(instance => { 
    return {
      html: component.render(instance.attr, {hydratable:true}).toString(),
      id: instance.id
    }
  });

  const clientDepsCompiled = resolveDependencies(src);
  const clientDepsScripts = clientDepsCompiled.map(compile => compile.js);
  const clientDepsStyles = clientDepsCompiled.map(compile => compile.css)
    .filter(style=>style!==null);
  const {js, css} = compileClient(src); 
  const compData = fs.readFileSync(src, 'utf8');

  return {
    hooks: hooks, // ssr projection of component to attach to
    scripts: [...clientDepsScripts, js.code], // component scripts or logic
    initScript: constructor(encodeContentForName(compData), instances), 
    styles: (css.code!==null) ? [css.code, ...clientDepsStyles] : clientDepsStyles   
  };
};

export default loader;
