import cheerio from 'cheerio';

import fs from 'fs';
import path from 'path';

import { loader } from './svelteLoader';
import { hyphenCaseToTitleCase } from './string';
import { encodeStr } from './encoding';

const createInlineHtml = (name, loader, $, attr) => {
  const src = path.resolve(__dirname, `../__tests__/resource/svelte/${name}.html`);
  const { inline } = loader(src, attr, []);
  const el = $(inline)
  return el; 
};

const createEndScript = (name, loader, params) => {
  const src = path.resolve(__dirname, `../__tests__/resource/svelte/${name}.html`);
  const { end } = loader(src, {}, params);
  return end; 
};

const createHead = (name, loader) => {
  const src = path.resolve(__dirname, `../__tests__/resource/svelte/${name}.html`);
  const { head } = loader(src, {}, []);
  return head.map(script => `<script>${script}</script>`).join("\n");
}

// Has to be a better way to do this~
const HTML5_ELEMENT_NAMES = ['div', 'base', 'head', 'link', 'meta', 'style', 'title', 
'body', 'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 
'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'dir', 'dl', 
'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre', 'ul', 'a', 'abbr', 
'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 
'rb', 'rtc', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup','time', 'u', 
'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video', 'applet', 'embed', 
'iframe', 'noembed', 'object', 'param', 'picture', 'source', 'canvas', 'noscript', 
'script', 'del', 'ins', 'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 
'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 
'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 
'details', 'dialog', 'menu', 'menuitem', 'summary', 'content', 'element', 'shadow', 
'slot', 'template'];
const isCustomElement = (node) => {
  return node.type === 'tag' && !HTML5_ELEMENT_NAMES.includes(node.name);
}

export const compile = (html, loader) => {
  const $ = cheerio.load(html, { normalizeWhitespace: true });
  var elRefs = new Map();
  $('body').children().filter((i, node) => isCustomElement(node)).each((i, node) => {
    const name = hyphenCaseToTitleCase(node.name);
    const el = createInlineHtml(name, loader, $, node.attribs);
    const id = `belte-${i}`;
    el.attr('id', `${id}`);
    if (elRefs.has(name)) {
      elRefs.set(name, [...elRefs.get(name), {id: id, attr: node.attribs}]);
    } else {
      elRefs.set(name, [{id: id, attr: node.attribs}]);
    }
    $(node).replaceWith(el);
  });

  elRefs.forEach((params, name, map) => {
      $('head').append($(createHead(name,loader)));
      $('body').append($(`<script>${createEndScript(name, loader, params)}</script>`))
  });
  
  fs.writeFile(`${__dirname}/index.html`, $.html(), function(err, data) {
    if (err) console.log(err);
  });

  return $.html();
};

export const defaultCompile = (html) => {
  return compile(html, loader);
};

export default defaultCompile;
