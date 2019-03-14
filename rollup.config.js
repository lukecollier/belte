import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

let pkg = require('./package.json')

export default {
  input: './src/index.js',
  external: [ 
    'url', 'net', 'buffer', 'tty', 'os', 'fs', 'path', 'stream', 'events', 
    'string_decoder', 'util'
  ],
  plugins: [
    commonjs({
      exclude: 'node_modules/@babel/**',
      namedExports: { 'node_modules/@babel/parser/lib/index.js': ['parse' ] }
    }),
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]],
    })
  ],		
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ]
}
