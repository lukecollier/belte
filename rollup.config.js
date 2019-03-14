import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import sucrase from 'rollup-plugin-sucrase';

let pkg = require('./package.json')

function onwarn (warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  warn(warning);
}

export default {
  input: './src/index.js',
  external: [ 
    'url', 'net', 'buffer', 'tty', 'os', 'fs', 'path', 'stream', 'events', 
    'string_decoder', 'util'
  ],
  plugins: [
    json(),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['imports']
    }),
    commonjs(),
    resolve(),
  ],		
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  onwarn: onwarn
}
