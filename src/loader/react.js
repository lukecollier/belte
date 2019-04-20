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

require("sucrase/register");

export const render = (src, attr) => {
	const Component = require(src);
	const comp = React.createElement(Component.default, attr);
	return ReactDOMServer.renderToString(comp)
}

export const constructor = (name, id, attr, libraries) => 
  `${libraries["react-dom"]}.hydrate(
    ${libraries["react"]}.createElement(${name}, ${JSON.stringify(attr)}), 
    document.getElementById("${id}")
  );`; // need to find a way to compile this with global exports... this will allow the `import ReactDOM from "react-dom"` or `import React from "react"`

export const style = (_) => []

export const client = (buffer) => {
  return buffer.toString('utf8'); 
}

export const name = 'React';

export const isComponent = (src) => 
  isReact.component(require(src).default);

export const isLogic = (src) => 
  !isReact.component(require(src).default);
