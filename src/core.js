import cheerio from 'cheerio';

import fs from 'fs';

import { loader } from './svelteLoader';
import { hyphenCaseToTitleCase } from './helper';

const createInlineHtml = (name, loader, $) => {
  const dir = `../__tests__/resource/svelte/${name}.html`;
  const { inline } = loader(dir, {});
  const el = $(inline)
  return el; 
};

// todo move genscripts to head with defer option from the cdn
const createEndScript = (name, loader, ids) => {
  const dir = `../__tests__/resource/svelte/${name}.html`;
  const { end } = loader(dir, {});
  return `${end}${ids.map(id => constructorScript(name, id)).join('')}`; 
};

const constructorScript = (name, id, data = {}) => 
  `new ${name}({target:document.getElementById('${id}'),hydrate:true,data:{}});`

const TEMP_ELEMENT_NAMES = ['div', 'p', 'h1'];
const isCustomElement = (node) => {
  return node.type === 'tag' && !TEMP_ELEMENT_NAMES.includes(node.name);
}

export const compile = (html, loader) => {
  const $ = cheerio.load(html, { normalizeWhitespace: true });
  var elRefs = new Map();
  $('body').children()
    .filter((i, node) => isCustomElement(node))
    .each((i, node) => {
      const name = hyphenCaseToTitleCase(node.name);
      const el = createInlineHtml(name, loader, $);
      const id = `belte-${i}`;
      el.attr('id', `${id}`);
      if (elRefs.has(name)) {
        elRefs.set(name, [...elRefs.get(name), id]);
      } else {
        elRefs.set(name, [id]);
      }
      $(node).replaceWith(el);
    });
  elRefs.forEach((ids, name, map) => {
      $('body').append($(`<script>${createEndScript(name, loader, ids)}</script>`))
  });
  
  fs.writeFile(`${__dirname}/index.html`, $.html(), function(err, data) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });

  return $.html();
};

export const defaultCompile = (html) => {
  return compile(html, loader);
};

export default defaultCompile;
