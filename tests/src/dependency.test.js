import { resolve } from '../../src/dependency';
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
