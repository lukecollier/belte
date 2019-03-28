import * as rollup from 'rollup';

export async function loader(src, { encodeForFilename, encodeForVariableName }) {
  const inputOptions = {
    input: src,
    plugins: []
  }
  const bundle = await rollup.rollup(inputOptions);
  // logic here
  return {
    render: (src) => doARender(src, encode),
    plugins: () => [],
    dependencies: () => [
      'path/to/depOne.js',
      'path/to/depTwo.js'
    ] // might not need
  }
}
