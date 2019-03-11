import cheerio from 'cheerio';

import fs from 'fs';
import path from 'path';

import { loader } from './loader/svelte.js';
import { hyphenCaseToTitleCase } from './string';
import { encodeFromPath } from './encoding';
import { isCustomElement } from './dom';


const write = (filename, data) => {
  const dir = `${process.cwd()}/build`
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFile(`${dir}/${filename}`, data, function(err, data) {
    if (err) throw `Error writing ${filename}`;
    return filename;
  });

  return filename;
}

export const compile = (html, loader) => {
  const $ = cheerio.load(html, { 
    normalizeWhitespace: true, 
    recognizeSelfClosing: true 
  });

  var elRefs = new Map();
  $('body').children().filter((i, node) => isCustomElement(node)).each((i, node) => {
    const name = hyphenCaseToTitleCase(node.name);
    const id = `belte-${i}`;
    const el = $(`<div id="${id}"></div>`);
    if (elRefs.has(name)) {
      elRefs.set(name, [...elRefs.get(name), {id: id, attr: node.attribs}]);
    } else {
      elRefs.set(name, [{id: id, attr: node.attribs}]);
    }
    $(node).replaceWith(el);
  });


  elRefs.forEach((instances, name, map) => {
    const src = path.resolve(process.cwd(), `./__tests__/resource/svelte/${name}.html`);
    const {hooks, scripts, initScripts, styles} = loader(src, instances)
    styles.forEach(css => {
      write(encodeFromPath(css) + '.css', css)
      $('head').append($(`<link rel="stylesheet" href="/${encodeFromPath(css)}.css">`));
    });

    scripts.forEach(script => {
      write(encodeFromPath(script) + '.js', script)
      $('head').append($(`<script defer="true" src="/${encodeFromPath(script)}.js"></script>`));
    });
    write(encodeFromPath(initScripts) + '.js', initScripts);
    $('head').append($(`<script defer="true" src="/${encodeFromPath(initScripts)}.js"></script>`));
    hooks.forEach(hook => {
      const result = $(hook.html);
      result.attr('id', hook.id);
      $(`#${hook.id}`).replaceWith($(result))
    });
    // createHead(name, loader, params).forEach(script=>$('head').append($(script)));
  });
  
  write(`${encodeFromPath($.html())}.html`, $.html());

  return $.html();
};

export const defaultCompile = (html) => {
  return compile(html, loader);
};

export default defaultCompile;
