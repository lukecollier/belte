require('svelte/ssr/register');
const svelte = require('svelte');

const { nameFromPath, filenameFromPath } = require('./helper');

const defaultConfig = {
  src: './src', // location of components
  el: './dist', // the target directory
}

//ssr rendered component
const render = (src, att) => {
  const component = require(src);
  return component.render(att, {hydratable:true,css:false}).toString();
};

// js extracted 
// additional optimization by building a dependency graph of components and ordering them by this to reduce amount of code needed depending on sveltes impl of other components

const javascript = (src, att) => {
	const options = {
		generate: 'dom',
		css: false,	
		hydratable: true,
    name: nameFromPath(src), // todo get filename and titlecase it
    filename: filenameFromPath(src), // todo get filename and titlecase it
		format: 'iife',
	};
	const { js } = svelte.compile(src, options, att);
	return js;
};

// todo sourcemaps when in development
// todo only currently compiles the components css, this is useful as we can optimize into one style sheet per page without duplication, this could use a dependency graph to figure out what components have already been included in the style sheet, exciting. Not mvp due to atomizer being a good intemediate solution
const css = (src, att) => {
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

const loader = (src, att) => {
  return {
    head: css(src, att), 
    inline: render(src, att),
    end: javascript(src, att)
  };
};

module.exports = { 
  render: render,
  javascript: javascript,
  css: css,
  loader: loader
};
