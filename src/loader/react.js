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


export const render = (src, attr) => {
	const Component = require(src);
	const comp = React.createElement(Component.default, attr);
	return ReactDOMServer.renderToString(comp)
}

export const constructor = (name, id, attr) => `ReactDOM.hydrate(
    React.createElement(${name}, ${JSON.stringify(attr)}), 
    document.getElementById("${id}")
  );`;

export const client = (buffer) => {
  return buffer.toString('utf8'); 
}

export const name = 'React';

export const isComponent = (src) => 
  isReact.component(require(src).default);

export const isLogic = (src) => 
  !isReact.component(require(src).default);
