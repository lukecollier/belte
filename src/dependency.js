import { keys, zipWith, map, values, flatten, concat, prepend, fromPairs } from 'ramda';
import pathUtil from 'path';
import jsx from 'acorn-jsx';
import * as acorn from 'acorn';
import fs from 'fs';
import util from 'util';
import { walk } from 'estree-walker';
import nodeResolve from 'resolve';

/**
 * Resolves an component file using the relevent loader cyclically will generate
 * other components.
 * @param {string} src - The source path for the component.
 * @param {Function} filter - Function explaining how to tell to include in the list or not 
 * component.
 * @returns {(string|Array)} - A list of dependent client scripts in call order.
 */
export const resolve = (src, filter) => {
	const sources = imports(src, filter);
	const recurse = map(({ src }) => resolveAsList(src, filter), sources);
  return prepend(src, map(({src})=>src, flatten(concat(sources, recurse))));
}

/**
 * Resolves an component file using the relevent loader cyclically will generate
 * other components.
 * @param {string} src - The source path for the component.
 * @param {Function} filter - Function explaining how to tell to include in the list or not 
 * component.
 * @returns {(string|Array)} - A list of dependent client scripts in call order.
 */
export const resolveAsList = (src, filter) => {
	const sources = imports(src, filter);
	const recurse = map(({ src }) => resolveAsList(src, filter), sources);
  return flatten(concat(sources, recurse));
}

/**
 * Finds all imports alises and sources for an file 
 * @param {string} src - The source path for the file.
 * @param {Function} filter - Filtering function.
 * @returns {(string|Array)} - A list of dependent client scripts in call order.
 */
export const imports = (src, filter) => {
  const content = fs.readFileSync(src,'utf8');
  const result = acorn.Parser.extend(jsx()).parse(content, {sourceType: "module"});
  var sources = [];
  walk(result, { enter: function (node, parent ) {
    if (node.type === 'ImportDeclaration') {
      const alias = node.source.value;
      const value = nodeResolve.sync(alias, { basedir: pathUtil.dirname(src) });
      if (filter(value)) {
        sources.push({ src: value, alias: alias }); 
      }
    }
  }});
  return sources;
}
