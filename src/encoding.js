import Hashids from 'hashids';

export const encodeStr = (str) => {
  const hashids = new Hashids('salt-me', 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const sumCharacters = [...str]
    .map((_, i)=>str.charCodeAt(i))
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  return hashids.encode(sumCharacters);
}
