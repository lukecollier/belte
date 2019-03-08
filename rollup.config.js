import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

let pkg = require('./package.json')

export default {
  input: './src/index.js',
  external: [ 'cheerio', 'svelte', 'svelte/ssr/register' ],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/env'],
    })
  ],		
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ]
}
