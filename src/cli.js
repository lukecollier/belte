import { compile } from './core.js' 
import path from 'path';
import {readFileSync, accessSync, constants, mkdirSync, writeFile} from 'fs';
import { loader as sveltev2Loader } from './loader/sveltev2.js';
import { loader as reactLoader } from './loader/react.js';

const {R_OK, W_OK} = constants;

var argv = require('minimist')(process.argv.slice(2));

const [first, ...components] = argv._;
if (!argv.help && first === 'on' && components.length !== 0) {
  const template = getNeededAttr('template');
  const output = getNeededAttr('output');
  const templateSrc = path.resolve(process.cwd(), template);
  const target = path.resolve(process.cwd(), output);
  if (canAccessPaths([...components, templateSrc, target])) {
    const data = readFileSync(templateSrc, 'utf8');
    try {
      const opts = {
        components: components,
        salt: 'default-salt'
      };

      const loader = getOptionalAttr('loader');
      const compiled = (loader.err) ? 
        compile(data, opts) : compile(data, opts, getLoader(loader.name))
      
      compiled.css.forEach(css => {
        write(`${target}/${css.name}.css`, css.code)
      });
      compiled.js.forEach(js => {
        write(`${target}/${js.name}.js`, js.code)
      });
      const index = getOptionalAttr('index');
      if (index.err) {
        write(`${target}/index.html`, compiled.html)
      } else {
        const indexSrc = path.resolve(process.cwd(), index.name);
        write(indexSrc, compiled.html)
      }
    } catch (e) {
      exitWithError(`failed to compile ${e}`);
    }
  }
} else {
	help();
}
function getLoader(loader) {
  switch(loader) {
    case 'react':
      return reactLoader;
    case 'sveltev2':
      return sveltev2Loader; 
  }
}

function canAccessPaths(paths) {
  return paths.reduce((acc, src) => {
    return acc && tryAccess(src)
  });
}

function tryAccess(src) {
  try {
    accessSync(src, W_OK); 
    return true;
  } catch (_err) {
    exitWithError(`can't access output file at "${src}", do you have access and the file exists?`);
  }
}

function help() {
  console.log('todo: implement help');
}

function getOptionalAttr(attr) {
  const shortName = attr.substring(0,1);
  if (present(attr)) {
    return { name: argv[attr] }
  } else if (present(shortName)) {
    return { name: argv[shortName] }
  } else {
    return { err: `${attr} not given`, name: attr} 
  }
}

function getNeededAttr(attr) {
  const shortName = attr.substring(0,1);
  if (present(attr)) {
    return argv[attr]
  } else if (present(shortName)) {
    return argv[shortName]
  } else {
    exitWithError(`missing needed parameter: ${attr} ${shortName}`);
  }
}

function present(name) {
  return Object.keys(argv).includes(name)
}

function exitWithError(message) {
  console.log('[error]', message);
  process.exit(1);
}

function write(target, data) {
  const src = path.resolve(process.cwd(), target)
  mkdirSync(path.dirname(target), { recursive: true });
  writeFile(target, data, (err) => {
    if (err) {
      exitWithError(err);
    } else {
      console.log('successs!', `written to "${src}"`);
    }});
}
