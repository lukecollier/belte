import { resolveSources, compile, aliasFromSource } from '../../src/core';
import { readFileSync } from 'fs'; 
import pathUtil from 'path';

test('can resolve a singular src to an object with name', () => {
  const result = resolveSources(['fake/path/to/file.js']);
  expect(result).toEqual({'file': 'fake/path/to/file.js'});
});

test('can resolve a singular src to an object with name from camel case', () => {
  const result = resolveSources(['fake/path/to/FileName.js']);
  expect(result).toEqual({'file-name': 'fake/path/to/FileName.js'});
});

test('can resolve multiple sources to an object with name from camel case', () => {
  const result = resolveSources(['fake/path/to/FileName.js', './FileNameTwo.js']);
  expect(result).toEqual({'file-name': 'fake/path/to/FileName.js', 'file-name-two': './FileNameTwo.js'});
});

test('gives a best guess for the alias of the source', () => {
  const result = aliasFromSource('alias/to/path/index.js');
  expect(result).toBe('path');
});

test('gives a best guess for the alias of the source', () => {
  const result = aliasFromSource('alias/to/path.js');
  expect(result).toBe('alias/to/path.js');
});

test.skip('can render a react component', async () => {
  const comp = pathUtil.resolve(__dirname, '../resource/react/BelteSingular.jsx');
  const opts = {
    components: [comp],
    salt: 'default-salt'
  };
  const path = pathUtil.resolve(__dirname, '../resource/html/01-single.html');
  const result = compile(
    readFileSync(path, 'utf8'), 
    opts, require('../../src/loader/react')); 

  expect(await result).toMatchSnapshot();
});
