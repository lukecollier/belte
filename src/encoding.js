import Hashids from 'hashids';

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

export const encodeContentForName = (content) => {
  const hashids = new Hashids('salt-me', 8, hashAlphabet);
  return 'Svelte' + hashids.encode(positiveHashCode(content));
}

export const encodeContentForFilename = (content) => {
  const hashids = new Hashids('salt-me', 8, hashAlphabet);
  return 'SvelteComponent' + '.' + hashids.encode(positiveHashCode(content));
}
