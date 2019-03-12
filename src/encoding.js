import Hashids from 'hashids';

import { nameFromPath } from './string.js';

export const encodeStr = (str) => {
  const hashids = new Hashids('salt-me', 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const sumCharacters = [...str]
    .map((_, i)=>str.charCodeAt(i))
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  return hashids.encode(sumCharacters);
}

// naive as the ordering of characters doesn't matter and will need to be tackled
export const encodeFromPath = (path) => {
  const hashids = new Hashids('salt-me', 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  const sumCharacters = [...path]
    .map((_, i)=>path.charCodeAt(i))
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  return 'Svelte' + '$' + hashids.encode(sumCharacters);
}

// naive as the ordering of characters doesn't matter and will need to be tackled
export const encodeContentForName = (content) => {
  const hashids = new Hashids('salt-me', 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  const sumCharacters = [...content]
    .map((_, i)=>content.charCodeAt(i))
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  return 'SvelteComponent' + '.' + hashids.encode(sumCharacters);
}
