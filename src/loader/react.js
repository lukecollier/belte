import ReactDOMServer from 'react-dom/server';
import React from 'react';
import * as R from 'ramda';

import { readFileSync } from 'fs';

const recast = require("recast");
const { NodePath, builders } = require("ast-types");
const acorn = require('acorn');
const rollup = require('rollup');

export const render = (src, attr) => {
	const Component = require(src);
	const comp = React.createElement(Component, attr);
	return ReactDOMServer.renderToString(comp)
}

export const client = (code, name) => {
  const ast = recast.parse(code, {praser: acorn, sourceType: 'module'});
  var deps = [];
  recast.visit(ast, { 
    visitImportDeclaration: function(path) {
      path.prune();
      return false;
    },
    visitExportDefaultDeclaration: function (path) {
      path.replace(`return ${path.value.declaration.name};`);
      return false;
    },  
    visitCallExpression: function (path) {
      if (path.value.callee 
        && path.value.callee.name === 'require'
        && path.value.arguments 
        && path.value.arguments.length === 1) { // there has to be a better way
        deps.push(path.parent.value.id.name);
        path.parent.prune();
      }
      return false;
    },
    visitAssignmentExpression: function (path) {
      if (path.value.left 
        && path.value.left.object 
        && path.value.left.object.name 
        && path.value.left.object.name === 'module'){
        path.replace(`return ${path.value.right.name}`);
      }
      return false;
    }
  });
  return `
    var ${name} = (function(${deps.join(',')}) {
      ${recast.print(ast).code}
    })(${deps.join(',')})`.trim();
}

const isComponent = (component) => component.prototype 
  && component.prototype.isReactComponent

export const dependencies = (src) => {
  const ast = recast.parse(code, {praser: acorn, sourceType: 'module'});
  var deps = [];
  var components = [];
  recast.visit(ast, { 
    visitCallExpression: function (path) {
      if (path.value.callee 
        && path.value.callee.name === 'require'
        && path.value.arguments 
        && path.value.arguments.length === 1) { // there has to be a better way
        deps.push(path.parent.value.id.name);
      }
      return false;
    },
  });
  return [...deps, 'ReactDOM'];
}

export const constructor = (name, id, attr) => `ReactDOM.hydrate(React.createElement(${name}, ${JSON.stringify(attr)}), document.getElementById("${id}"));`;

// way to check if a component is a react component for dependencies
// Component.prototype 
// 	&& Component.prototype.isReactComponent 
export const loader = (src, encode) => {
  const data = readFileSync(src, 'utf8');
  const name = 'React' + encode(data);

  return {
    render: R.partial(render, [src]),
    client: R.partial(client, [data, name]),
    styles: () => [],
    constructor: R.partial(constructor, [name]),
    dependencies: () => [],
    otherDependencies: () => [],
  }
};

export default loader;
