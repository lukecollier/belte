import ReactDOMServer from 'react-dom/server';
import React, { Component } from 'react';
import * as rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export const render = (src, attr) => {
	const Component = require(src).default;
	const comp = React.createElement(Component, attr);
	return ReactDOMServer.renderToString(comp)
}

export const client = (src, encode) => {
  const comp = readFileSync(src, 'utf8');
	// walk the tree, remove imports for react, reactDOm that will be included globally
	return `React.createElement(HelloMessage, { name: "Taylor" })`
}

export async function loaderTest(src, { encodeForFilename, encodeForVariableName }) {
  const inputOptions = {
    input: src,
    external: (_) => true,
    plugins: [ 
      babel({
        babelrc: false, 
        presets: ['@babel/preset-react', '@babel/preset-env']
      }), 
      commonjs({include: 'node_modules/**'}) 
    ],
  }
  const outputOptions = {
    format: 'iife',
    name: 'ComponentName',
    file: 'test.js',
  }
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.isAsset) {
      console.log('asset', chunkOrAsset.source);
    } else { 
      console.dir(chunkOrAsset.modules);
    }
  }

  return {
    render: (src) => '',
    javascript: () => [],
    style: () => [],
    dependencies: () => [
      'path/to/depOne.js',
      'path/to/depTwo.js'
    ]
  }
}

// way to check if a component is a react component for dependencies
// Component.prototype 
// 	&& Component.prototype.isReactComponent 
export const loader = (src, encode) => {
  const data = readFileSync(src, 'utf8');
  const dir = pathUtil.dirname(src);
  const name = encode(data);

  const compDeps = () => deps(src).filter(filepath => filepath.endsWith('.html')); 
  const otherDeps = () => deps(src).filter(filepath => !filepath.endsWith('.html')); 

  return {
    render: R.partial(render, [src]),
    client: R.partial(client, [dir, data, encode]),
    styles: R.partial(style, [data]),
    constructor: R.partial(constructor, [name]),
    dependencies: compDeps,  
    otherDependencies: otherDeps,  
  }
};
