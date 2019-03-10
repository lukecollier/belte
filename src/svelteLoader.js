import 'svelte/ssr/register';
import * as svelte from 'svelte';

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

import fs from 'fs';
import path from 'path';

const { nameFromPath, filenameFromPath } = require('./helper');

/**
 * A dependency tree object.
 * @typedef {Object} Dependencies
 * @property {Array(Dependencies)} Downstream - Downstream dependenices.
 * @property {String} filePath - File path location for dependency.
 */

/**
 * Config options available
 * @typedef {Object} Config
 * @property {String} src - Source files glob.
 * @property {String} target - Path to location.
 */

//ssr rendered component
export const render = (src, att) => {
  const component = require(src);
  return component.render(att, {hydratable:true,css:false}).toString();
};

/**
 * Get's a depdency tree of components and javascript modules.
 * @function dependencies
 * @param {string} data - Calculates a dependency tree from string.
 * @param {string} filePath - Svelte file to calculate for.
 * @returns {Set} a list of dependencies
 */
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
        // we need to change specifiers to be uniquely generated id's for each depdendent bundle
        console.log(p.node.specifiers[0].local.name);
        const src = path.resolve(dir, valuePath);
        const compData = fs.readFileSync(src, 'utf8');
        dependencies(compData, src).forEach(dep => deps.add(dep));
      }    
      deps.add(valuePath);
    }
  });
  return deps;
}

export const javascript = (src, att) => {
  const resolveSrc = path.resolve(__dirname, src);
  const data = fs.readFileSync(resolveSrc, 'utf8');
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: nameFromPath(src),
    filename: filenameFromPath(src),
		format: 'iife',
	};
	const compiled = svelte.compile(data, options, att);
	return compiled.js.code;
};

// GONNA NEED BIGGA GUN, legit though we need to change the 
// todos
// - *investigate preprocessors on main components*
// - figure our generating unique id's for import alias's
export const resolveDependencies = (src) => {
  const resolveSrc = path.resolve(__dirname, src);
  const data = fs.readFileSync(resolveSrc, 'utf8');
  var result = [];
  const deps = dependencies(data, resolveSrc)
    .forEach(relativePath => {
      const dir = path.dirname(resolveSrc);
      const resolvedPath = path.resolve(dir, relativePath);
      result.push(javascript(resolvedPath, {}));
    });
  return result; 
}


export const css = (src, att) => {
  const component = require(src);
	const options = {
		generate: 'ssr',
		css: true,	
		hydratable: false,
    name: nameFromPath(src), // todo get filename and titlecase it
    filename: filenameFromPath(src), // todo get filename and titlecase it
		format: 'iife',
	};
  return component.render(att, options).css;
};

export const loader = (src, att) => {
  return {
    head: [css(src, att), ...resolveDependencies(src)], 
    inline: render(src, att),
    end: javascript(src, att)
  };
};

export default loader;
