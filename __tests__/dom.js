import cheerio from 'cheerio';

const test = require('ava');

import { isCustomElement, allChildren } from '../src/dom.js';

test('can get nested elements into a single list', t => {
  const $ = cheerio.load('<body><div><p><span></span></p><div><h1></h1><p></p></div></div></body>')
  const result = allChildren($('body')).map(cheerioObj => cheerioObj.name);
	t.deepEqual(result, ['div', 'p', 'span', 'div', 'h1', 'p'])
});
