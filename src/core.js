import cheerio from 'cheerio';

import fs from 'fs';
import path from 'path';
import * as fg from 'fast-glob';

import { loader } from './loader/svelte.js';
import { hyphenCaseToTitleCase, nameFromPath } from './string.js';
import { encodeFromPath, encodeContentForName } from './encoding.js';
import { isCustomElement, allChildren } from './dom.js';

const defaultOpts = {
  target: './dist/index.html',
  cwd: process.cwd(),
  source: '__tests__/resource/svelte/**.html',
  legacy: false // support old browsers
};

const write = (filename, data) => {
  const dir = `${process.cwd()}/build`
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(`${dir}/${filename}`, data, function(err, data) {
    if (err) throw `Error writing ${filename}`;
    return filename;
  });
}

export const findComponentsPaths = (componentNames, glob) => {
  const entries = fg.sync([glob]);
  var foundPaths = [];
  entries.forEach(path => {
    const name = nameFromPath(path)
    if (componentNames.includes(name)) {
      foundPaths.push(path);
    }
  });
  return foundPaths;
}

export const compile = (html, loader, opts = defaultOpts) => {
  const $ = cheerio.load(html, { 
    normalizeWhitespace: true, 
    recognizeSelfClosing: true 
  });

  var elRefs = new Map();
  allChildren($('body')).filter((node) => isCustomElement(node)).map((node, i) => {
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

  const paths = findComponentsPaths([...elRefs.keys()], opts.source);

  var headElements = new Set();
  elRefs.forEach((instances, name, map) => {
    const foundPath = paths.filter(path=>nameFromPath(path)===name)[0];
    const src = path.resolve(process.cwd(), foundPath);
    const {hooks, scripts, initScript, styles} = loader(src, instances);
    
    styles.forEach(css => {
      write(encodeContentForName(css) + '.css', css)
      headElements.add(
        `<link rel="stylesheet" href="/${encodeContentForName(css)}.css">`
      );
    });

    [...scripts, initScript].forEach(script => {
      write(encodeContentForName(script) + '.js', script)
      headElements.add(
        `<script defer="true" src="/${encodeContentForName(script)}.js"></script>`
      );
    });
    // don't like these hooks for inserting the html
    hooks.forEach(hook => {
      const result = $(hook.html);
      result.attr('id', hook.id);
      $(`#${hook.id}`).replaceWith($(result))
    });
  });

  Array.from(headElements).forEach(element => $('head').append($(element)));
  
  write(`${encodeContentForName($.html())}.html`, $.html());
  write(`index.html`, $.html());

  return $.html();
};

export const defaultCompile = (html, opts = defaultOpts) => {
  return compile(html, loader, opts);
};

export default defaultCompile;
