import test from 'ava';

import fs from 'fs';

import { defaultCompile } from '../src/core.js';


const resource = (filename) => `${__dirname}/resource/template/${filename}`;

test('template-one-element renders one element', t => {
  const data = fs.readFileSync(resource('template-one-element.html'), 'utf8');
  const result = defaultCompile(data);
  t.snapshot(result);
});

test('template-two-attributes renders one element with attributes', t => {
  const data = fs.readFileSync(resource('template-two-attributes.html'), 'utf8');
  const result = defaultCompile(data);
  t.snapshot(result);
});

test('template-three-multiple can render multiple components', t => {
  const data = fs.readFileSync(resource('template-three-multiple.html'), 'utf8');
  const result = defaultCompile(data);
  t.snapshot(result);
});

test('template-four-multiple-args renders multiple components with multiple args', 
  t => {
    const data = fs.readFileSync(resource('template-four-multiple-args.html'), 'utf8');
    const result = defaultCompile(data);
    t.snapshot(result);
  });

