import Hashids from 'hashids';
import XXH from 'xxhashjs';

const hashAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// uses the java hashCode function to generate string number, need's investigating the entropy 
const hashCode = (s) => {
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
};

const positiveHashCode = (s) => {
  return hashCode(s) & 0xfffffff;
}

/**
 * Encodes content to a semi unique id (collisions are too damn high).
 * @param {string} content - Content of a file to encode.
 * @param {string} salt - Application specific string for salting hashes 
 * component.
 * @returns {string} - An id.
 */
export const encodeContent = (content, salt = 'salt',) => {
  const hashids = new Hashids(salt, 16, hashAlphabet);
  return hashids.encode(positiveHashCode(content));
}

export const encodeForFileName = (buff, salt = 'salt',) => {
  const saltBuff = Buffer.from(salt);
  const totalLength = buff.length + saltBuff.length;
  return XXH.h32(Buffer.concat([buff, saltBuff], totalLength), 0xCAFEBABE).toString(16);
}

export const encodeForBrowser = (content, salt = 'salt',) => {
  const hashids = new Hashids(salt, 16, hashAlphabet);
  return hashids.encode(positiveHashCode(content));
}
