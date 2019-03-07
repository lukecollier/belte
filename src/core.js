const domino = require('domino');
const HTMLUnknownElement = domino.impl.HTMLUnknownElement;

const { loader } = require('./svelteLoader');
const { hyphenCaseToTitleCase } = require('./helper');

const parse = (htmlString) => {
  return domino.createDocument(htmlString, true);
};

const documentToString = (document) => {
  return document.documentElement.outerHTML;
}

const createInlineElement = (localName, loader) => {
  const name = hyphenCaseToTitleCase(localName);
  const dir = `../__tests__/resource/svelte/${name}.html`;
  const { inline } = loader(dir, {});
  
  return inline; 
};

const compile = (html, loader) => {
  const document = parse(html);
  document._nodes
    .filter((el) => el instanceof HTMLUnknownElement)
    .forEach((el) => 
      el.parentNode.replaceWith(createInlineElement(el.localName, loader)));

  return documentToString(document);
};

const defaultCompile = (html) => {
  return compile(html, loader);
};

module.exports = { 
  compile: compile, 
  defaultCompile: defaultCompile 
};
