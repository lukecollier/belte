import * as rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export async function loader(src, { encodeForFilename, encodeForVariableName }) {
  const inputOptions = {
    input: src,
    external: (_) => true,
    plugins: [ 
      babel({
        babelrc: false, 
        presets: ['@babel/preset-react', '@babel/preset-env']
      }), 
      commonjs({include: 'node_modules/**'}) 
    ],
  }
  const outputOptions = {
    format: 'iife',
    name: 'ComponentName',
    file: 'test.js',
  }
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.isAsset) {
      console.log('asset', chunkOrAsset.source);
    } else { 
      console.dir(chunkOrAsset.modules);
    }
  }

  return {
    render: (src) => '',
    javascript: () => [],
    style: () => [],
    dependencies: () => [
      'path/to/depOne.js',
      'path/to/depTwo.js'
    ]
  }
}
