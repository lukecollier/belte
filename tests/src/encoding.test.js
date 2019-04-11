import { encodeForFileName } from '../../src/encoding';
import { readFileSync } from 'fs';
import pathUtil from 'path';

test('hash is consistent for filesnames', () => {
  const path = pathUtil.resolve(__dirname, '../resource/hashme.txt');
  
  const result = encodeForFileName(readFileSync(path), 'salty');
  expect(result).toMatchSnapshot();
});

test('changing contents changes the hash', () => {
  const path = pathUtil.resolve(__dirname, '../resource/hashme.txt');
  
  const orig = encodeForFileName(readFileSync(path), 'salty');
  const mute = encodeForFileName(Buffer.concat([
    readFileSync(path), 
    Buffer.from('hello')
  ]), 'salty');

  expect(orig).not.toBe(mute);
});
