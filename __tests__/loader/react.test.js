import test from 'ava';

import { resolve } from 'path';
import {readFileSync } from 'fs';

import { render, client, constructor, loader } from '../../src/loader/react.js';
import { compile } from '../../src/core.js';

const resource = (filename) => {
  return resolve(`${__dirname}`, `../resource/react/${filename}`);
}

const templateResource = (filename) => {
  return resolve(`${__dirname}`, `../resource/template/${filename}`);
}

const opts = {
  components: [
    '__tests__/resource/react/CustomElementOne.js',
  ],
  salt: 'default-salt'
};

test('can render a react component statically', t => {
  const result = render(resource('CustomElementOne.js'), {name: 'Robert'});
  t.snapshot(result);
});

test('can create a constructor for components', t => {
  const result = constructor('CustomElementOne', 'el', {name: 'Robert'});
  t.snapshot(result);
});

test('can generate a loader', t => {
  const result = loader(resource('CustomElementOne.js'), (name)=>name);
  t.snapshot(result);
});

test('can render client javascript for react in iife', t => {
  const data = readFileSync(resource('CustomElementOne.js'), 'utf8');
  const result = client(data, "CustomElementOne");
  t.snapshot(result);
});

test('can create an single element', t => {
  const data = readFileSync(templateResource('one-element.template.html'), 'utf8');
  const result = compile(data, opts, loader);
  t.snapshot(result.html);
});
