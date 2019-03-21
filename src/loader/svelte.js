

const svelte = require('svelte');
const acorn = require('acorn');
import { walk } from 'estree-walker';
import Hashids from 'hashids';
import * as R from 'ramda';

import fs from 'fs';
import pathUtil from 'path';

import { nameFromPath, filenameFromPath } from '../string.js';
import { encodeContent } from '../encoding.js';

const dependencies = (data, filePath) => {
  var deps = new Set();
  const dir = pathUtil.dirname(filePath);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: nameFromPath(filePath),
    filename: filenameFromPath(filePath),
		format: 'es'
	};
	const compiled = svelte.compile(data, options);
  const ast = acorn.parse(compiled.js.code, {sourceType: 'module'});
  walk(ast, {
    enter: ( node, parent ) => {
      if (node.type === 'ImportDeclaration') {
        const valuePath =  node.source.value.toString();
        if (valuePath.endsWith('.html')) {
          const src = pathUtil.resolve(dir, valuePath);
          const compData = fs.readFileSync(src, 'utf8');
          dependencies(compData, src).forEach((srcPath, alias) => { 
            deps.add(srcPath);
          });
          deps.add(valuePath);
        }
      }
    },
    leave: ( node, parent ) => {
    }
  });
  return deps;
}

export const compileClient = (src, encode) => {
  const compData = fs.readFileSync(src, 'utf8');
  const dir = pathUtil.dirname(src);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: encode(compData, 'Svelte'),
    filename: encode(compData, 'Svelte.'),
		format: 'iife',
    globals: (relPath) => {
      const resolved = pathUtil.resolve(dir, relPath);
      const data = fs.readFileSync(resolved, 'utf8');
      return encode(data, 'Svelte');
    }
	};
	const compiled = svelte.compile(compData, options);
	return compiled;
};

export const makeRender = (path) => {
  const src = pathUtil.resolve(process.cwd(), path);
  require('svelte/ssr/register');
  const component = require(src);
  return (attr) => component.render(attr).html;
}

export const resolveDependencies = (src, encode) => {
  const data = fs.readFileSync(src, 'utf8');
  var result = new Set();
  const deps = dependencies(data, src);
  const dir = pathUtil.dirname(src);
  for (const key of deps.keys()) {
    const resolvedPath = pathUtil.resolve(dir, key);
    const {js, css} = compileClient(resolvedPath, encode);
    result.add({js: js.code, css: css.code});
  };
  
  return Array.from(result); 
}

const constructor = (constructorName, instances) => 
  instances.map(instance => `new ${constructorName}({target:document.getElementById('${instance.id}'),hydrate:true,data:${JSON.stringify(instance.attr)}});`).join('');

export const loader = (src, instances = [{id: '', attr: {}}], 
  encode = R.partialRight(encodeContent, ['salt'])) => {

  const clientDepsCompiled = resolveDependencies(src, encode);
  const scriptsDeps = clientDepsCompiled.map(compile => compile.js);
  const stylesDeps = clientDepsCompiled.map(compile => compile.css)
    .filter(style => style !== null);
  const {js, css} = compileClient(src, encode); 
  const compData = fs.readFileSync(src, 'utf8');
  const initScript = constructor(encode(compData, 'Svelte'), instances);

  return {
    scripts: [
      ...scriptsDeps, 
      js.code, 
      initScript
    ],
    styles: (css.code !== null) ? [css.code, ...stylesDeps] : stylesDeps  
  };
};

export default loader;
