import { compile } from './core.js' 
import path from 'path';
import {readFileSync, accessSync, constants, mkdirSync, writeFile} from 'fs';
import { forEachObjIndexed } from 'ramda';

// our basic loaders for svelte 2 and react
import * as react from './loader/react.js'; 
import * as sveltev2 from './loader/sveltev2.js'; 

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
        components: components.map(src => path.resolve(process.cwd(), src)),
        salt: 'default-salt'
      };

      const loader = getOptionalAttr('loader');
      const { js, html } = compileIt(loader,data, opts, target);
    } catch (e) {
      exitWithError(`failed to compile ${e}`);
    }
  }
} else {
	help();
}

async function compileIt (loader, data, opts, target) {
  const compiled = (loader.err) ? 
    compile(data, opts, react) : compile(data, opts, getLoader(loader.name))
  compiled.then(result => {
    forEachObjIndexed((code, key)=>{
      write(`${target}/${key}.js`, code);
    }, result.js);
    const index = getOptionalAttr('index');
    if (index.err) {
      write(`${target}/index.html`, result.html)
    } else {
      const indexSrc = path.resolve(process.cwd(), index.name);
      write(indexSrc, result.html)
    }
  }).catch(err=>exitWithError(err));
}


function getLoader(loader) {
  switch(loader) {
    case 'react':
      return react; 
    case 'sveltev2':
      return sveltev2; 
    default:
      exitWithError(`loader not supported yet`);
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
