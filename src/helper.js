export const stripExtension = (filename) => {
  return filename.substring(0, filename.indexOf(".")); 
};

export const filenameFromPath = (path) => {
  return path.substring(path.lastIndexOf('/')+1, path.length);
};

export const nameFromPath = (path) => {
  const filename = filenameFromPath(path);
  return stripExtension(filename);
};

export const hyphenCaseToTitleCase = (str) => {
  const lowStr = str.toLowerCase();
  var result = [];
  var lastPos = -1;
  for(var currPos=0; currPos < lowStr.length; currPos++) {
    if (str[currPos] === '-') {
      result.push(lowStr.substring(lastPos + 1, currPos));
      lastPos = currPos;
    }
  }
  result.push(lowStr.substring(lastPos+1, lowStr.length));
  return result.map((lowStr)=>lowStr.charAt(0).toUpperCase() + lowStr.slice(1)).join("");
};
