import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import sucrase from 'rollup-plugin-sucrase';
import strip from 'rollup-plugin-strip-shebang';

let pkg = require('./package.json');

function onwarn (warning, warn) {
  warn(warning);
}

const acornOpts = { allowHashBang: true };
const treeshake = true;
const externalOpts = [
  'url', 'net', 'buffer', 'tty', 'os', 'fs', 'path', 'stream', 'events', 
  'string_decoder', 'util', 'module', 'crypto', 'constants', 'assert'
]

const plugins = [
	strip(),
  json(),
  resolve(),
  commonjs({
		include: 'node_modules/**',
    extensions: [ '.js', '.html' ],
    namedExports: {
      'node_modules/dom5/lib/index.js': [ 'query', 'queryAll', 'replace', 'append' ],
      'micromatch': [ 'matcher' ],
      'resolve': [ 'sync' ]
    }
  }),
  sucrase({
    exclude: ['node_modules/**'],
    transforms: []
  }),
]

export default [
  {
    input: './src/index.js',
		treeshake:treeshake,
		acorn: acornOpts,
    external: externalOpts,
    plugins: plugins,		
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: false },
      { file: pkg.module, format: 'es', sourcemap: false }
    ],
    onwarn: onwarn
  },
  {
    input: './src/cli.js',
		treeshake:treeshake,
		acorn: acornOpts,
    external: externalOpts,
    plugins: plugins,		
    output: [
      { 
        banner: '#!/usr/bin/env node',
        file: pkg.bin.belte,
        format: 'cjs', 
        sourcemap: false 
      },
    ],
    onwarn: onwarn
  }
]
