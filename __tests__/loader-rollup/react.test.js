import test from 'ava';
import { loader } from '../../src/loader-rollup/react.js';
import { resolve } from 'path';

test('test loader can load functions', async t => {
  const src = resolve(process.cwd(), './__tests__/resource/react/CustomElementOne.js'); 
  const result = loader(src, {
    encodeForFilename: (_) => _,
    encodeForVariableName: (_) => _
  });
  t.snapshot(await result);
});

