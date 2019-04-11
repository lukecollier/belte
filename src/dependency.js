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
export const resolve = (src, filter, transform = (_) => _) => {
	const sources = imports(src, filter, transform);
	const recurse = map(({ src }) => resolveAsList(src, filter, transform), sources);
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
export const resolveAsList = (src, filter, transform = (_) => _) => {
	const sources = imports(src, filter, transform);
	const recurse = map(({ src }) => resolveAsList(src, filter, transform), sources);
  return flatten(concat(sources, recurse));
}

/**
 * Finds all imports alises and sources for an file 
 * @param {string} src - The source path for the file.
 * @param {Function} filter - Filtering function.
 * @returns {(string|Array)} - A list of dependent client scripts in call order.
 */
export const imports = (src, filter, transform = (_) => _) => {
  const content = transform(fs.readFileSync(src,'utf8'));
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
