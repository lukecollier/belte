import RewritingStream from 'parse5-html-rewriting-stream';
import parse5 from 'parse5';
import * as dom5 from 'dom5';
import { hyphenCaseToTitleCase } from './string.js';

const HTML5_ELEMENT_NAMES = ['html', 'div', 'base', 'head', 'link', 'meta', 'style', 'title', 'body', 'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'dir', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre', 'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rtc', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup','time', 'u', 'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video', 'applet', 'embed', 'iframe', 'noembed', 'object', 'param', 'picture', 'source', 'canvas', 'noscript', 'script', 'del', 'ins', 'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'details', 'dialog', 'menu', 'menuitem', 'summary', 'content', 'element', 'shadow', 'slot', 'template'];
export const isCustomElement = (tagNode) => {
  return !HTML5_ELEMENT_NAMES.includes(tagNode.tagName);
}

export const parse = (html) => parse5.parse(html, {scriptingEnabled:false});

export const serialize = (dom) => parse5.serialize(dom);

export const appendToHead = (dom, headElements = []) => {
  const headSet = new Set(headElements);
  const head = dom5.query(dom, (el) => el.tagName === 'head');
  headSet.forEach(elementHtml => 
    dom5.append(head, parse5.parseFragment(elementHtml, {scriptingEnabled:false})));
}

export const domRefs = (dom, resolvers = {Default: (attr) => ''}) => {
  const body = dom5.query(dom, (el) => el.tagName === 'body');
  var refs = new Map();
  dom5.queryAll(body, (el) => isCustomElement(el)).forEach((el, i) => {
    const attribs = {};
    const id = `SvelteComponent-${i}`;
    el.attrs.forEach(attr => attribs[attr.name] = attr.value);
    const name = hyphenCaseToTitleCase(el.tagName);
    if (refs.has(name)) {
      refs.set(name, [...refs.get(name), {id: id, attr: attribs}]);
    } else {
      refs.set(name, [{id: id, attr: attribs}]);
    }
    if (name in resolvers) {
      const newEl = parse5.parseFragment(resolvers[name](attribs), {scriptingEnabled:false});
      const first = dom5.query(newEl, (el) => true);
      first.attrs.push({name: 'id', value: id});
      dom5.replace(el, newEl);
    } else {
      const newEl = parse5.parseFragment(resolvers.Default(attribs), {scriptingEnabled:false});
      const first = dom5.query(newEl, (el) => true);
      first.attrs.push({name: 'id', value: id});
      dom5.replace(el, newEl);
    }
  });
  return refs;
}
