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
    directory: process.cwd(),
    nodeModulesConfig: {
      entry: 'module'
    },
    filter: filter,
  });
}

// loader will instead just pass render function that exposes a src param
/**
 * Resolves a object of functions for rendering components based on name.
 * @param {string} sources - The paths to be loaded.
 * @param {Loader} loader - The loader to get the render function from.
 * @returns {(Function|Object)} - A map of rendering functions indexed by component name.
 */
export const htmlResolvers = (sources, loader) => 
  R.reduce(R.merge, {}, R.map(src=>R.objOf(src, loader(src).render), sources));
