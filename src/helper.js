const stripExtension = (filename) => {
  return filename.substring(0, filename.indexOf(".")); 
};

const filenameFromPath = (path) => {
  return path.substring(path.lastIndexOf('/')+1, path.length);
};

const nameFromPath = (path) => {
  const filename = filenameFromPath(path);
  return stripExtension(filename);
};

const hyphenCaseToTitleCase = (str) => {
  var result = [];
  var lastPos = -1;
  for(var currPos=0; currPos<str.length;currPos++) {
    if (str[currPos] === '-') {
      result.push(str.substring(lastPos+1, currPos));
      lastPos = currPos;
    }
  }
  result.push(str.substring(lastPos+1, str.length));
  return result.map((str)=>str.charAt(0).toUpperCase() + str.slice(1)).join("");
};

module.exports = {
  stripExtension: stripExtension,
  filenameFromPath: filenameFromPath,
  nameFromPath: nameFromPath,
  hyphenCaseToTitleCase: hyphenCaseToTitleCase
};
