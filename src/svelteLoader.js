import 'svelte/ssr/register';
import * as svelte from 'svelte';

import fs from 'fs';
import path from 'path';

const { nameFromPath, filenameFromPath } = require('./helper');

const defaultConfig = {
  src: './src/**', // location of components as a glob
  target: './dist', // the target directory for the static files
}

//ssr rendered component
export const render = (src, att, conf) => {
  const component = require(src);
  return component.render(att, {hydratable:true,css:false}).toString();
};

// we can extract dependencies by exporting an es module then traversing a pasrsed ast to get all the imports, if the imported file is html it needs svelte compiling otherwise babel that bad boy
export const javascript = (src, att, conf) => {
  const resolveSrc = path.resolve(__dirname, src);
  const data = fs.readFileSync(resolveSrc, 'utf8');
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: nameFromPath(src),
    filename: filenameFromPath(src), // todo get filename and titlecase it
		format: 'es',
	};
	const compiled = svelte.compile(data, options, att);
	return compiled.js.code;
};

// todo sourcemaps when in development
// todo only currently compiles the components css, this is useful as we can optimize into one style sheet per page without duplication, this could use a dependency graph to figure out what components have already been included in the style sheet, exciting. Not mvp due to atomizer being a good intemediate solution
export const css = (src, att, conf) => {
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
    head: css(src, att), 
    inline: render(src, att),
    end: javascript(src, att)
  };
};

export default loader;
