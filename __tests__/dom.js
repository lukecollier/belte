const test = require('ava');

import { 
  parse, 
  walk, 
  toString, 
  search, 
  isCustomElement,
  replaceElement } from '../src/dom.js';

test('can parse a string and encode it back to a string', t => {
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

test('can walk over a dom by filtering with multiple custom elements', t => {
  const dom = parse('<html><div><custom-element/><custom-element-two/></div><custom-element-three/></html>');
  const results = search(dom[0], (el) => isCustomElement(el)).map(el=>el.name);
	t.deepEqual(results, [
    'custom-element', 
    'custom-element-two', 
    'custom-element-three']);
});

test('can parse a singular element', t => {
  const dom = parse('<custom-element></custom-element>');
	t.deepEqual(dom[0], {type: 'tag', name: 'custom-element', attribs: {}, children:[],next:null,prev:null,parent:null});
});

test('can replace an element with another', t => {
  const dom = parse('<html><custom-element></custom-element></html>');
  replaceElement(dom[0].children[0], '<custom-element-two/>');
  t.deepEqual(toString(dom[0].children[0]), '<custom-element-two></custom-element-two>');
});
