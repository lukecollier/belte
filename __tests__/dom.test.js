const test = require('ava');

import parse5 from 'parse5';
const { parse, domRefs } = require('../src/dom.js');

test('parsing a document creates an object', t => {
  const dom = parse("<html><head><title></title></head><body><custom-element></custom-element></body></html>");
  const result = domRefs(dom, {Default: (attr) => '<p>hello</p>'});
	t.snapshot(dom);
	t.snapshot(result);
});

