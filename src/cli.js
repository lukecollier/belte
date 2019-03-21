import { compile } from './core.js' 
import path from 'path';
import {readFileSync, accessSync, constants, mkdirSync, writeFile} from 'fs';

const {R_OK, W_OK} = constants;

var argv = require('minimist')(process.argv.slice(2));

if (argv._[0] === 'on' && argv._.length === 1 && !argv.help){
  const input = getNeededAttr('input');
  const output = getNeededAttr('output');
  const inputSrc = path.resolve(process.cwd(), input);
  const outputSrc = path.resolve(process.cwd(), output);
  try {
    accessSync(inputSrc, R_OK); 
  } catch (_err) {
    exitWithError(`can't access input file at "${inputSrc}", do you have access and the file exists?`);
  }
  try {
    accessSync(outputSrc, W_OK); 
  } catch (_err) {
    exitWithError(`can't access output file at "${outputSrc}", do you have access and the file exists?`);
  }
  const data = readFileSync(inputSrc, 'utf8');
  try {
    const compiled = compile(data);
    compiled.css.forEach(css => {
      write(`${outputSrc}/${css.name}.css`, css.code)
    });
    compiled.js.forEach(js => {
      write(`${outputSrc}/${js.name}.js`, js.code)
    });
    write(`${outputSrc}/index.html`, compiled.html)
  } catch {
    exitWithError(`failed to compile`);
  }
  // process.stdout.write(JSON.stringify(compile(data)) + '\n');
} else {
  help();
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
  console.log(message);
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
