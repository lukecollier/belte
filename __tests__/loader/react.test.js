import test from 'ava';

import { resolve } from 'path';

import { render } from '../../src/loader/react.js';

const resource = (filename) => {
  return resolve(`${__dirname}`, `../resource/react/${filename}`);
}

test('can render a react component statically', t => {
  const result = render(resource('CustomComponentOne.js'), {name: 'Robert'});
  t.snapshot(result);
});
