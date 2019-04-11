const svelte = require('svelte');
import * as R from 'ramda';
import { readFileSync } from 'fs';
import  pathUtil from 'path';
import { walk } from 'estree-walker';
const acorn = require('acorn');

export const render = (src, _) => {
  return readFileSync(src, 'utf8')
}
