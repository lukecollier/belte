import Hashids from 'hashids';
import { nameFromPath } from './string.js';

export const encodeStr = (str) => {
  const hashids = new Hashids('salt-me', 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const sumCharacters = [...str]
    .map((_, i)=>str.charCodeAt(i))
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  return hashids.encode(sumCharacters);
}

export const encodeFromPath = (path) => {
  const hashids = new Hashids('salt-me', 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  const sumCharacters = [...path]
    .map((_, i)=>path.charCodeAt(i))
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  return 'Svelte' + '$' + hashids.encode(sumCharacters);
}
