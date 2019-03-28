## Namespaces
Currently when multiple components in different sub directories have the same name the resolution is to take the first one we find. If we find people have a demand for this we can implement a namespacing strategy for the tags, for example an attribute could be added

e.g
```html
<custom-element></custom-element>
<custom-element namespace="path/to/other/element"></custom-element>
```
where source contains `CustomElement.html` and `path/to/other/element/CustomElement.html`
