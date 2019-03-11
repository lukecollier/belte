import 'svelte/ssr/register';
import * as svelte from 'svelte';

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import Hashids from 'hashids';

import fs from 'fs';
import path from 'path';

import { nameFromPath, filenameFromPath } from '../string';
import { encodeFromPath } from '../encoding';

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

export const compileClient = (src) => {
  const compData = fs.readFileSync(src, 'utf8');
  const dir = path.dirname(src);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: encodeFromPath(src),
    filename: filenameFromPath(src),
		format: 'iife',
    globals: (relPath) => {
      const resolved = path.resolve(dir, relPath);
      return encodeFromPath(resolved);
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
  instances.map(instance => `new ${constructorName}({target:document.getElementById('${instance.id}'),hydrate:true,data:${JSON.stringify(instance.attr)}});`).join('')
  

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
  const clientDepsStyles = clientDepsCompiled.map(compile => compile.css);
  const {js, css} = compileClient(src); 

  const encodedSrc = encodeFromPath(src);

  const initScripts = constructor(encodeFromPath(src), instances);  
  return {
    hooks: hooks, // ssr projection of component to attach to
    scripts: [...clientDepsScripts, js.code], // component scripts or logic
    initScripts: initScripts, // scripts to load components, keep in an array for resilliancey reasons
    styles: [css.code, ...clientDepsStyles] // styling generated during component compilation
  };
};

export default loader;
