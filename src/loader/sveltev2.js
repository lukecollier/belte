const svelte = require('svelte');
import * as R from 'ramda';
import { readFileSync } from 'fs';
import  pathUtil from 'path';
import { walk } from 'estree-walker';
const acorn = require('acorn');

export const render = (src, attr) => {
  require('svelte/ssr/register');
  const component = require(src);
  return require(src).render(attr).html
}

export const client = (src, encode) => {
  const comp = readFileSync(src, 'utf8');
  const dir = pathUtil.dirname(src);
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: 'Svelte' + encode(comp),
    filename: 'Svelte' + encode(comp) + '.js',
		format: 'iife',
    globals: (relPath) => {
      const data = readFileSync(pathUtil.resolve(dir, relPath), 'utf8');
      return 'Svelte' + encode(data);
    }
	};
	return svelte.compile(comp, options).js.code;
}

export const style = (src) => {
  const data = readFileSync(src, 'utf8');
	const options = {
		generate: 'dom',
		css: true,	
		format: 'cjs'
	};
	return svelte.compile(data, options).css.code;
}

export const constructor = (name, id, attr) => 
  `new ${"Svelte" + name}({target:document.getElementById('${id}'),hydrate:true,data:${JSON.stringify(attr)}});`;

const builtins = require("module").builtinModules;
export const imports = (code, dir) => {
  var deps = new Set();
  walk(acorn.parse(code, {sourceType: 'module'}), {
    enter: ( node, parent ) => {
      if (node.type === 'ImportDeclaration') {
        const source =  node.source.value.toString();
        if (source.endsWith('.html')) {
          deps.add(pathUtil.resolve(dir, source));
        } else if (!builtins.includes(source)) {
          const path = pathUtil.resolve(dir, source)
          deps.add(require.resolve(path));
        } else {
          throw Error('Module does not exist or is a node module');
        }
      }
    },
    leave: ( node, parent ) => {}
  });
  return Array.from(deps);
}

export const deps = (src) => {
  const data = readFileSync(src, 'utf8');
	const options = {
		generate: 'dom',
		css: false,	
		format: 'es'
	};
	const code = svelte.compile(data, options).js.code;
  return imports(code, pathUtil.dirname(src)).map(src => { 
    return [src, deps(src)].flat()
  }).flat();
}

export const loader = (src, encode) => {
  const data = readFileSync(src, 'utf8');
  const name = encode(data);

  const compDeps = () => deps(src).filter(filepath => filepath.endsWith('.html')); 
  const otherDeps = () => deps(src).filter(filepath => !filepath.endsWith('.html')); 

  return {
    render: R.partial(render, [src]),
    client: R.partial(client, [src, encode]),
    styles: R.partial(style, [src]),
    constructor: R.partial(constructor, [name]),
    dependencies: compDeps,  
    otherDependencies: otherDeps,  
  }
};

export default loader;
