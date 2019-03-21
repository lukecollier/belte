import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import sucrase from 'rollup-plugin-sucrase';

let pkg = require('./package.json')

function onwarn (warning, warn) {
  warn(warning);
}

const plugins = [
  json(),
  sucrase({
    exclude: ['node_modules/**'],
    transforms: []
  }),
  commonjs({
    extensions: [ '.js', '.html' ],
    namedExports: {
      'node_modules/dom5/lib/index.js': [ 'query', 'queryAll', 'replace', 'append' ]
    }}),
  resolve(),
]

export default [
  {
    input: './src/index.js',
    external: [ 
      'url', 'net', 'buffer', 'tty', 'os', 'fs', 'path', 'stream', 'events', 
      'string_decoder', 'util'
    ],
    plugins: plugins,		
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    onwarn: onwarn
  },
  {
    input: './src/cli.js',
    external: [ 
      'url', 'net', 'buffer', 'tty', 'os', 'fs', 'path', 'stream', 'events', 
      'string_decoder', 'util'
    ],
    plugins: plugins,		
    output: [
      { 
        file: pkg.bin.belte,
        banner: '#!/usr/bin/env node',
        format: 'cjs', 
        sourcemap: true 
      },
    ],
    onwarn: onwarn
  }
]
