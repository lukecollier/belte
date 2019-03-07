const cheerio = require('cheerio');

const { loader } = require('./svelteLoader');
const { hyphenCaseToTitleCase } = require('./helper');

const createInlineElement = (localName, loader) => {
  const name = hyphenCaseToTitleCase(localName);
  const dir = `../__tests__/resource/svelte/${name}.html`;
  const { inline } = loader(dir, {});
  return inline; 
};

const compile = (html, loader) => {
  const $ = cheerio.load(html);

  return $.html();
};

const defaultCompile = (html) => {
  return compile(html, loader);
};

module.exports = { 
  compile: compile, 
  defaultCompile: defaultCompile 
};
