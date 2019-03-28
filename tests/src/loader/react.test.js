const loader = require('../../../src/loader/react');
const path = require('path');

test('adds 1 + 2 to equal 3', () => {
  const encoders = {encodeForFilename: (_) => _, encodeForVariableName: (_) => _};
  const result = loader(path.resolve(__dirname, '../../resource/react/Component.js'), encoders);
  expect(sum(1, 2)).toMatchSnapshot();
});
