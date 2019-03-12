import cheerio from 'cheerio';

const HTML5_ELEMENT_NAMES = ['div', 'base', 'head', 'link', 'meta', 'style', 'title', 
'body', 'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 
'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'dir', 'dl', 
'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre', 'ul', 'a', 'abbr', 
'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 
'rb', 'rtc', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup','time', 'u', 
'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video', 'applet', 'embed', 
'iframe', 'noembed', 'object', 'param', 'picture', 'source', 'canvas', 'noscript', 
'script', 'del', 'ins', 'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 
'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 
'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 
'details', 'dialog', 'menu', 'menuitem', 'summary', 'content', 'element', 'shadow', 
'slot', 'template'];
export const isCustomElement = (node) => {
  return node.type === 'tag' && !HTML5_ELEMENT_NAMES.includes(node.name);
}

export const allChildren = (elements) => {
  const tree = elements.children().map((_, el) => {
    return [el, ...allChildren(cheerio(el))]
  });
  return tree.get().flat();
}
