import cheerio from 'cheerio';
import fs from 'fs';
import 'svelte/ssr/register';
import svelte from 'svelte';
import path from 'path';

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

var stripExtension = function stripExtension(filename) {
  return filename.substring(0, filename.indexOf("."));
};

var filenameFromPath = function filenameFromPath(path) {
  return path.substring(path.lastIndexOf('/') + 1, path.length);
};

var nameFromPath = function nameFromPath(path) {
  var filename = filenameFromPath(path);
  return stripExtension(filename);
};

var hyphenCaseToTitleCase = function hyphenCaseToTitleCase(str) {
  var lowStr = str.toLowerCase();
  var result = [];
  var lastPos = -1;

  for (var currPos = 0; currPos < lowStr.length; currPos++) {
    if (str[currPos] === '-') {
      result.push(lowStr.substring(lastPos + 1, currPos));
      lastPos = currPos;
    }
  }

  result.push(lowStr.substring(lastPos + 1, lowStr.length));
  return result.map(function (lowStr) {
    return lowStr.charAt(0).toUpperCase() + lowStr.slice(1);
  }).join("");
};

var helper = {
  stripExtension: stripExtension,
  filenameFromPath: filenameFromPath,
  nameFromPath: nameFromPath,
  hyphenCaseToTitleCase: hyphenCaseToTitleCase
};

var nameFromPath$1 = helper.nameFromPath,
    filenameFromPath$1 = helper.filenameFromPath;

var render = function render(src, att, conf) {
  var component = commonjsRequire(src);
  return component.render(att, {
    hydratable: true,
    css: false
  }).toString();
}; // svelte uses es modules, to accomadate this we will need to write a preproccess for correctly building these modules only once and being available when the component loads, can be done using a dependency graph of some sort
// other option is to just bundle every component into their respective bundle


var javascript = function javascript(src, att, conf) {
  var resolveSrc = path.resolve(__dirname, src);
  var data = fs.readFileSync(resolveSrc, 'utf8');
  var options = {
    generate: 'dom',
    css: false,
    hydratable: true,
    name: nameFromPath$1(src),
    filename: filenameFromPath$1(src),
    // todo get filename and titlecase it
    format: 'es'
  };
  var compiled = svelte.compile(data, options, att);
  return compiled.js.code;
}; // todo sourcemaps when in development
// todo only currently compiles the components css, this is useful as we can optimize into one style sheet per page without duplication, this could use a dependency graph to figure out what components have already been included in the style sheet, exciting. Not mvp due to atomizer being a good intemediate solution


var css = function css(src, att, conf) {
  var component = commonjsRequire(src);
  var options = {
    generate: 'ssr',
    css: true,
    hydratable: false,
    name: nameFromPath$1(src),
    // todo get filename and titlecase it
    filename: filenameFromPath$1(src),
    // todo get filename and titlecase it
    format: 'iife'
  };
  return component.render(att, options).css;
};

var loader = function loader(src, att) {
  return {
    head: css(src, att),
    inline: render(src, att),
    end: javascript(src, att)
  };
};

var svelteLoader = {
  render: render,
  javascript: javascript,
  css: css,
  loader: loader
};

var loader$1 = svelteLoader.loader;
var hyphenCaseToTitleCase$1 = helper.hyphenCaseToTitleCase;

var createInlineHtml = function createInlineHtml(name, loader, $) {
  var dir = "../__tests__/resource/svelte/".concat(name, ".html");

  var _loader = loader(dir, {}),
      inline = _loader.inline;

  var el = $(inline);
  return el;
}; // todo move genscripts to head with defer option from the cdn


var createEndScript = function createEndScript(name, loader, ids) {
  var dir = "../__tests__/resource/svelte/".concat(name, ".html");

  var _loader2 = loader(dir, {}),
      end = _loader2.end;

  return "".concat(end).concat(ids.map(function (id) {
    return constructorScript(name, id);
  }).join(''));
};

var constructorScript = function constructorScript(name, id) {
  return "new ".concat(name, "({target:document.getElementById('").concat(id, "'),hydrate:true,data:{}});");
};

var TEMP_ELEMENT_NAMES = ['div', 'p', 'h1'];

var isCustomElement = function isCustomElement(node) {
  return node.type === 'tag' && !TEMP_ELEMENT_NAMES.includes(node.name);
};

var compile = function compile(html, loader) {
  var $ = cheerio.load(html, {
    normalizeWhitespace: true
  });
  var elRefs = new Map();
  $('body').children().filter(function (i, node) {
    return isCustomElement(node);
  }).each(function (i, node) {
    var name = hyphenCaseToTitleCase$1(node.name);
    var el = createInlineHtml(name, loader, $);
    var id = "belte-".concat(i);
    el.attr('id', "".concat(id));

    if (elRefs.has(name)) {
      elRefs.set(name, [].concat(_toConsumableArray(elRefs.get(name)), [id]));
    } else {
      elRefs.set(name, [id]);
    }

    $(node).replaceWith(el);
  });
  elRefs.forEach(function (ids, name, map) {
    $('body').append($("<script>".concat(createEndScript(name, loader, ids), "</script>")));
  });
  fs.writeFile("".concat(__dirname, "/index.html"), $.html(), function (err, data) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
  return $.html();
};

var defaultCompile = function defaultCompile(html) {
  return compile(html, loader$1);
};

var core = {
  compile: compile,
  defaultCompile: defaultCompile
};
var core_2 = core.defaultCompile;

export default core_2;
efaultCompile = function defaultCompile(html) {
  return compile(html, loader$1);
};

var core = {
  compile: compile,
  defaultCompile: defaultCompile
};
var core_2 = core.defaultCompile;

module.exports = core_2;
