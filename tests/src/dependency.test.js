import { resolve, imports, resolveAsList } from '../../src/dependency';
import pathUtil from 'path';

const getResource = (path) => pathUtil.resolve(__dirname, '../resource/'+path);

test('can resolve a file with one dependency', () => {
  const result = resolveAsList(getResource('react/ComponentTwo.jsx'), (_) => true);
	expect(result).toEqual([
		{"alias": "react", "src": "/Users/collierl/Project/Tinker/belte/node_modules/react/index.js"}, 
		{"alias": "./Component.jsx", "src": "/Users/collierl/Project/Tinker/belte/tests/resource/react/Component.jsx"}, 
		{"alias": "react", "src": "/Users/collierl/Project/Tinker/belte/node_modules/react/index.js"}
	]);
});

test('resolves a file into a list of strings', () => {
  const result = resolve(getResource('react/ComponentTwo.jsx'), (_) => true);
	expect(result).toEqual([
		"/Users/collierl/Project/Tinker/belte/tests/resource/react/ComponentTwo.jsx", 
		"/Users/collierl/Project/Tinker/belte/node_modules/react/index.js", 
		"/Users/collierl/Project/Tinker/belte/tests/resource/react/Component.jsx", 
		"/Users/collierl/Project/Tinker/belte/node_modules/react/index.js"
	]);
});

test('gathers the imports from a file', () => {
  const result = imports(getResource('react/ComponentTwo.jsx'), (_) => true);
	expect(result).toEqual([
		{"alias": "react", 
      "src": "/Users/collierl/Project/Tinker/belte/node_modules/react/index.js"}, 
		{"alias": "./Component.jsx", 
      "src": "/Users/collierl/Project/Tinker/belte/tests/resource/react/Component.jsx"}, 
	]);
});
