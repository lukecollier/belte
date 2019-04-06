import { head, reduce, tail, toUpper, toLower } from 'ramda';

export const stripExtension = (filename) => {
  const pos = filename.lastIndexOf(".");
  return (pos === -1) ? filename : filename.substring(0, pos);
};

export const filenameFromPath = (path) => {
  return path.substring(path.lastIndexOf('/')+ 1, path.length);
};

export const nameFromPath = (path) => {
  const filename = filenameFromPath(path);
  return stripExtension(filename);
};


export const hypenCaseFromPath = (path) => {
  const isUpper = (ch) => toUpper(ch) === ch;
  const titleCase = nameFromPath(path);
  const lowerCasedHead = toLower(head(titleCase)) + tail(titleCase);
  return reduce((acc, ch) => 
    (isUpper(ch)) ?  `${acc}-${toLower(ch)}` : `${acc}${ch}`, '', lowerCasedHead);
};
