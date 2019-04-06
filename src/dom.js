import parse5 from 'parse5';
import { reduce, assoc, filter, clone, not, pick, omit, isNil, partial, mapObjIndexed, toPairs, is, pipe } from 'ramda';
import * as dom5 from 'dom5';

const HTML5_ELEMENT_NAMES = ['html', 'div', 'base', 'head', 'link', 'meta', 'style', 'title', 'body', 'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'dir', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre', 'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rtc', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup','time', 'u', 'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video', 'applet', 'embed', 'iframe', 'noembed', 'object', 'param', 'picture', 'source', 'canvas', 'noscript', 'script', 'del', 'ins', 'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'details', 'dialog', 'menu', 'menuitem', 'summary', 'content', 'element', 'shadow', 'slot', 'template'];
export const isCustomElement = (tagNode) => {
  return !HTML5_ELEMENT_NAMES.includes(tagNode.tagName);
}

export const parse = (html) => parse5.parse(html, {scriptingEnabled:false});

export const serialize = (dom) => parse5.serialize(dom);

export const appendToHead = (dom, headElements) => {
  const rendered = clone(dom);
  const headSet = new Set(headElements);
  const head = dom5.query(dom, (el) => el.tagName === 'head');
  headSet.forEach(elementHtml => 
    dom5.append(head, parse5.parseFragment(elementHtml, {scriptingEnabled:false}))
  );
  return rendered;
}

const serializeAttribs = 
  pipe(toPairs, reduce((acc, [name, value]) => `${acc}${name}="${value}"`,''));

const id = (num) => `belte-component-${num}`; 

const assocNameValue = (acc, {name, value}) => assoc(name, value, acc);

export const replaceWith = (dom, render, resolveSrc) => {
  const rendered = clone(dom);
  const reservedAttrs = ['class', 'style', 'href']
  const body = dom5.query(rendered, (el) => el.tagName === 'body');
  dom5.queryAll(body, (el) => isCustomElement(el)).forEach((el, i) => {
    const attrs = reduce(assocNameValue, {}, el.attrs);
    const htmlAttrs = pick(reservedAttrs, attrs);
    const props = omit(reservedAttrs, attrs);
    const newEl = parse5.parseFragment(`
      <div id="${id(i)}" ${serializeAttribs(htmlAttrs)}>
        ${render(resolveSrc[el.tagName], props)}
      </div>`, { scriptingEnabled: false });
    dom5.replace(el, newEl);
  });
  return rendered;
}

export const customElements = (dom) => {
  const body = dom5.query(dom, (el) => el.tagName === 'body');
  return dom5.queryAll(body, (el) => isCustomElement(el)).map((el, i) => {
    const attribs = reduce(assocNameValue, {}, el.attrs);
    return {id: id(i), attr: attribs, name: el.tagName}
  });
}
