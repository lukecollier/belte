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

const serializeAttribs = (attribs) => {
  return attribs.map(attr => `${attr.name}="${attr.value}"`).join(' ');
}

// replace with returning a list of { src: '', id: '', data: '' }
// then will reduce the list afterwards for rendering of javascript to 
// {src: '' instances: [{id: '', data: ''}, ] iterate on keys (src) and add all dependencies to the head of file with every instance budnled into a constructor file placed directly after
export const domRefs = (dom, resolvers = {Default: (attr) => ''}) => {
  const reservedAttrib = ['class', 'style', 'href']
  const body = dom5.query(dom, (el) => el.tagName === 'body');
  var refs = new Map();
  dom5.queryAll(body, (el) => isCustomElement(el)).forEach((el, i) => {
    const attribs = {};
    const id = `svelte-component-${i}`;
    var appliedAttribs = [];
    el.attrs.forEach(attr => {
      if (reservedAttrib.includes(attr.name)) {
        appliedAttribs.push(attr);
      } else {
        attribs[attr.name] = attr.value
      }
    });
    const name = hyphenCaseToTitleCase(el.tagName);
    if (refs.has(name)) {
      refs.set(name, [...refs.get(name), {id: id, attr: attribs}]);
    } else {
      refs.set(name, [{id: id, attr: attribs}]);
    }
    if (name in resolvers) {
      const newEl = parse5.parseFragment(`<div id="${id}" ${serializeAttribs(appliedAttribs)}>`+resolvers[name](attribs)+'</div>', {scriptingEnabled:false});
      dom5.replace(el, newEl);
    } else {
      dom5.replace(el, `<div><!-- error loading component ${name}--></div>`);
    }
  });
  return refs;
}
