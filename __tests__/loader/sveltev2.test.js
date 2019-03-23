import test from 'ava';

import { readFileSync } from 'fs';
import { resolve } from 'path';

import { imports, deps } from '../../src/loader/sveltev2.js';

const resource = (filename) => {
  return resolve(`${__dirname}`, 
    `../resource/svelte/${filename}`);
}

test('gets first level imports from a file', t => {
  const result = imports(`
    import test from '../../src/loader/sveltev2.js';
    `, __dirname);
  t.deepEqual(result, ['/Users/collierl/Project/Tinker/belte/src/loader/sveltev2.js']);
});

test('do not allow node modules', t => {
  const result = () => {imports(`
    import path from 'path';
    import fs from 'fs';`, __dirname)};
  t.throws(result, 'Module does not exist or is a node module')
});

test('gets svelte dependencies', t => {
  const result = deps(resource('LogicElement.html'));

  t.deepEqual(result, [ resource('PlainElement.html') ]);
});

test('gets multiple nested svelte dependencies', t => {
  const result = deps(resource('CustomElement.html'));
  t.deepEqual(result, [ 
    resource('PlainElement.html'), 
    resource('LogicElement.html'), 
    resource('PlainElement.html') 
  ]);
});

test('gets non component dependencies', t => {
  const result = deps(resource('ExternalLogicElement.html'));
  t.deepEqual(result, [ 
    resource('externalLogic.js'), 
    resource('PlainElement.html'), 
  ]);
});
