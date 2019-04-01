import { loaderTest, loader } from '../../../src/loader/react';
import path from 'path';

test('loader can be loaded', () => {
  const result = loader(path.resolve(__dirname, '../../resource/react/StatefulComponent.jsx'), (_) => _);
  expect(result).toMatchSnapshot();
});

