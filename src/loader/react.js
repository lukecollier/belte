import ReactDOMServer from 'react-dom/server';
import React, { Component } from 'react';

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
