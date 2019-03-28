import test from 'ava';

import { readFileSync } from 'fs';
import { resolve } from 'path';

import { loader } from '../../src/loader/sveltev2.js';
import { compile } from '../../src/core.js';

const resource = (filename) => {
  return resolve(`${__dirname}`, `../resource/template/${filename}`);
}
const opts = {
  components: [
    '__tests__/resource/svelte/CustomElement.html',
    '__tests__/resource/svelte/CustomElementOne.html',
    '__tests__/resource/svelte/CustomElementTwo.html',
    '__tests__/resource/svelte/CustomElementThree.html',
    '__tests__/resource/svelte/LogicElement.html',
    '__tests__/resource/svelte/PlainElement.html',
  ],
  salt: 'default-salt'
};

test('can create an single element', t => {
  const data = readFileSync(resource('one-element.template.html'), 'utf8');
  const result = compile(data, opts, loader);
  t.snapshot(result.html);
});

test('can create elements with attributes', t => {
  const data = readFileSync(resource('two-attributes.template.html'), 'utf8');
  const result = compile(data, opts, loader);
  t.snapshot(result.html);
});

test('can create multiple custom elements', t => {
  const data = readFileSync(resource('three-multiple.template.html'), 'utf8');
  const result = compile(data, opts, loader);
  t.snapshot(result.html);
});

test('can create multiple custom elements with args', t => {
  const data = readFileSync(resource('four-multiple-args.template.html'), 'utf8');
  const result = compile(data, opts, loader);
  t.snapshot(result.html);
});
