import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import sucrase from 'rollup-plugin-sucrase';

let pkg = require('./package.json')

function onwarn (warning, warn) {
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
      transforms: []
    }),
    commonjs(),
    resolve(),
  ],		
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  onwarn: onwarn
}
