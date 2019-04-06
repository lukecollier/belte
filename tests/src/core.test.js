import { resolveSources, compile } from '../../src/core';
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

test('can render a react component', () => {
  const comp = pathUtil.resolve(__dirname, '../resource/react/BelteSingular.jsx');
  const opts = {
    components: [comp],
    salt: 'default-salt'
  };
  const path = pathUtil.resolve(__dirname, '../resource/html/01-single.html');
  const result = compile(
    readFileSync(path, 'utf8'), 
    opts, require('../../src/loader/react')); 

  expect(result).toMatchSnapshot();
});
