import cheerio from 'cheerio';

import fs from 'fs';
import path from 'path';
import * as fg from 'fast-glob';

import { loader } from './loader/svelte.js';
import { hyphenCaseToTitleCase, nameFromPath } from './string.js';
import { encodeFromPath, encodeContentForName } from './encoding.js';
import { isCustomElement, allChildren } from './dom.js';

const defaultOpts = {
  target: './build/index.html',
  source: '__tests__/resource/svelte/**.html'
};

const write = (target, data) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
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

export const compile = (html, loader = loader, opts = defaultOpts) => {
  const $ = cheerio.load(html, { 
    recognizeSelfClosing: false,
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
      const resolved = path.resolve(process.cwd(), './build/' + encodeContentForName(css) + '.css');
      write(resolved, css)
      headElements.add(`<link rel="stylesheet" href="/${encodeContentForName(css)}.css">`);
    });

    [...scripts, initScript].forEach(script => {
      const resolved = path.resolve(process.cwd(), './build/' + encodeContentForName(script) + '.js');
      write(resolved, script)
      headElements.add(`<script defer="true" src="/${encodeContentForName(script)}.js"></script>`);
    });
    // don't like these hooks for inserting the html
    hooks.forEach(hook => {
      const result = $(hook.html);
      result.attr('id', hook.id);
      $(`#${hook.id}`).replaceWith($(result))
    });
  });

  Array.from(headElements).forEach(element => $('head').append($(element)));
  const target = path.resolve(process.cwd(), opts.target);
  write(target, $.html());

  return $.html();
};

export default defaultCompile;
