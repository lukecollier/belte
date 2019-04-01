import { resolve, htmlResolvers } from '../../src/dependency';
import pathUtil from 'path';

const getResource = (path) => pathUtil.resolve(__dirname, '../resource/'+path);

test('can resolve a file with one dependency', () => {
  const result = resolve(
    getResource('react/ComponentTwo.jsx'), 
    (path)=>path.indexOf('node_modules') === -1);
  expect(result).toEqual([
    getResource('react/Component.jsx'),
    getResource('react/ComponentTwo.jsx'), 
  ]);
});

test('can resolve html renderers object', () => {
  const loader = (src, _) => ({
    render: src + ":RENDERER"
  });
  const result = htmlResolvers(['/fake/path/to/Component.js'], loader);
  expect(result).toEqual(
    {'/fake/path/to/Component.js': '/fake/path/to/Component.js:RENDERER'});
});

test('can resolve multiple html renderers object', () => {
  const loader = (src, _) => ({
    render: src + ":RENDERER"
  });
  const result = htmlResolvers(['/fake/path/to/Component.js', '/fake/path/to/ComponentOne.js'], loader);
  expect(result).toEqual({
    '/fake/path/to/Component.js': '/fake/path/to/Component.js:RENDERER', 
    '/fake/path/to/ComponentOne.js': '/fake/path/to/ComponentOne.js:RENDERER'
  });
});
