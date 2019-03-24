import { compile } from './core.js' 
import path from 'path';
import {readFileSync, accessSync, constants, mkdirSync, writeFile} from 'fs';

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
      const compiled = compile(data, opts);
      compiled.css.forEach(css => {
        write(`${target}/${css.name}.css`, css.code)
      });
      compiled.js.forEach(js => {
        write(`${target}/${js.name}.js`, js.code)
      });
      write(`${target}/index.html`, compiled.html)
    } catch (e) {
      exitWithError(`failed to compile ${e}`);
    }
  }
} else {
	help();
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
