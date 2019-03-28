import { loader } from '../../../src/loader/react';
import path from 'path';

test('loader can be loaded', async () => {
  const encoders = {encodeForFilename: (_) => _, encodeForVariableName: (_) => _};
  const result = loader(path.resolve(__dirname, '../../resource/react/StatefulComponent.jsx'), encoders);
  expect(await result).toMatchSnapshot();
});
