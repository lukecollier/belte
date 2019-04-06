import * as R from 'ramda';
import dependencyTree from 'dependency-tree';
import pathUtil from 'path';

/**
 * Resolves an component file using the relevent loader cyclically will generate
 * other components.
 * @param {string} src - The source path for the component.
 * @param {Function} filter - Function explaining how to tell to include in the list or not 
 * component.
 * @returns {(string|Array)} - A list of dependent client scripts in call order.
 */
export const resolve = (src, filter) => {
  return dependencyTree.toList({
    filename: src,
    directory: pathUtil.dirname(src),
    nodeModulesConfig: {
      entry: 'module'
    },
    filter: filter,
  });
}
