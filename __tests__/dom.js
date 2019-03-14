const test = require('ava');

import { parse, walk, toString, search } from '../src/dom.js';

test('walks the dom performing a action', t => {
  const dom = parse('<div><p>Hello</p></div>');
	t.deepEqual(toString(dom), '<div><p>Hello</p></div>');
});

test('can walk over a dom and get names', t => {
  const dom = parse('<html><div><custom-element/></div></html>');
  const results = walk(dom[0], (el) => el.name);
	t.deepEqual(results, ['div', 'custom-element']);
});

test('can walk over a dom by filtering', t => {
  const dom = parse('<html><div><custom-element/></div></html>');
  const results = search(dom[0], (el) => el.name === 'custom-element').map(el=>el.name);
	t.deepEqual(results, ['custom-element']);
});
