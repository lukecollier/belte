import ReactDOMServer from 'react-dom/server';
import React, { Component } from 'react';
import * as rollup from 'rollup';
import * as R from 'ramda';
import commonjs from 'rollup-plugin-commonjs';
import sucrase from 'rollup-plugin-sucrase';
import { readFileSync } from 'fs';
import * as pathUtil from 'path';
import isReact from 'is-react';

import { nameFromPath } from '../string.js';
import { walk } from 'estree-walker';
const acorn = require("acorn").Parser.extend(require("acorn-jsx")());

// dependency package now handles dependencies from an output file,
// client (renamed build) - now builds the client to esm standard preffered takes any source
// dependencies - done in core 
// render - same
// constructor - same
// otherDependencies - done in core 
// styles - out of scope for now

export async function asyncClient(src, encodeForVariableName) {
  const data = readFileSync(src, 'utf8');
  const dir = pathUtil.dirname(src);
  const componentsSrc = imports(data, dir);
  const components = {};
  componentsSrc.forEach(src => components[src] = encodeForVariableName(readFileSync(src, 'utf8')));
  const inputOptions = {
    input: src,
    external: (id) => componentsSrc.includes(id) || id === 'react',
    plugins: [ 
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['jsx']
      }),
      commonjs({include: 'node_modules/**'}) 
    ],
  }
  const outputOptions = {
    format: 'iife',
    name: nameFromPath(src),
    globals: Object.assign(components, { react: 'React' }),
    file: 'test.js',
  }
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  var result;
  for (const chunkOrAsset of output) {
    if (chunkOrAsset.isAsset) {
    } else { 
      result = chunkOrAsset.code;
    }
  }
  return result;
}

export const render = (src, attr) => {
	const Component = require(src);
	const comp = React.createElement(Component, attr);
	return ReactDOMServer.renderToString(comp)
}

export const constructor = (name, id, attr) => `ReactDOM.hydrate(React.createElement(${name}, ${JSON.stringify(attr)}), document.getElementById("${id}"));`;

export const client = (code, name, encode) => {
  const ast = recast.parse(code, {praser: acorn, sourceType: 'module'});
  recast.visit(ast, { 
    visitImportDeclaration: function(path) {
      path.prune();
      return false;
    },
    visitExportDefaultDeclaration: function (path) {
      path.replace(`return ${path.value.declaration.name};`);
      return false;
    }  
  });
  return `
    var ${name} = (function(${deps.join(',')}) {
      ${recast.print(ast).code}
    })(${deps.join(',')})
  `.trim();
}

export const imports = (code, dir) => {
  var deps = [];
  const ast = acorn.parse(code, {sourceType: 'module'});
  walk(ast, { enter: ( node, parent ) => {
    if (node.type === 'ImportDeclaration') {
      const path =  node.source.value.toString();
      const src = pathUtil.resolve(dir, path);
      if (src.endsWith('.jsx') && isReact.component(require(src).default)) {
        deps.push(src);
      }
    }
  }});
  return deps;
}

// loaders will no longer return a mother object but instead export the respective files to be included in the regular way. allows for a simpler dx.
export const loader = (src, encode) => {
  const data = readFileSync(src, 'utf8');
  const dir = pathUtil.dirname(src);
  const name = encode(data);

  return {
    render: R.partial(render, [src]),
    client: R.partial(client, [dir, data, encode]),
    styles: () => [],
    constructor: R.partial(constructor, [name]),
    dependencies: () => R.partial(imports, [data, dir]),  
    components: () => R.partial(imports, [data, dir]),
  }
};
