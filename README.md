# belte [/belt-ah/](https://dictionary.cambridge.org/pronunciation/english/belt)
strap your svelte components onto plain old html

## CLI
We can use the cli by passing globs or paths for components and giving a html template including a output directory with -o.
`belte on __tests__/resource/svelte/*.html -t __tests__/resource/template/one-element.template.html -o build/`

## Q/A
- Q: Why?
  A: Inspired by the [JAM stack](https://jamstack.org/) I wanted to get all the benefits of a statically generated page with all the atomic, lean and interactivity of a javascript framework.
- Q: Why svelte?
  A: Svelte is a good place to start as it's easy to initialize and segregates itself into small bundles very nicely.
- Q: React soon?
  A: Not soon but with a generic enough solution we could add adapters to allow for any statically buildable javascript front end library to be used!

## Example

```html
<greeting name="luke">
  Hello, 
</greeting>
```

&darr; &darr; &darr;

```html
<head>
  <script src="output.js"/>
</head>
<!-- ... -->
<div id="belte-greeting-0000"></div> <!-- populate with the ssr default fields -->
<!-- ... -->
<script>
  var beltegreeting0000 = 
  new Greeting({
    target: document.getElementById("belte-greeting-0000"),
    data: { name: "luke", slot: "Hello, " }}
</script>
```

output.js contains example of svelte compiled greeting

## Quickstart

## Guide

## Roadmap
### 1.0 Stablilizing Api
completing the core working well with needed features 
- [x] -can get import and resolve node modules code- (should be handled by build tool)
- [ ] support multiple frameworks
- [ ] only update changed components using their names for caching during compilation
- [ ] decrease chance of collision using new hashing function encoding for filenames
- [ ] parse attributes as numbers and objects not just as strings
- [ ] debug options, e.g adding component names before hash versioning and source maps
- [ ] report errors and warning effectively
- [ ] test kit for loading components
- [ ] support self closing tags e.g ```html <thing/>```
- [ ] investigate licensing
- [ ] allow multiple loaders
- [x] include cli
- [ ] quickstart
- [ ] write guide
- [ ] optimize for under 5 seconds per template
- [ ] slot elements
- [ ] pass state through component trees
- [ ] syntax for generating states
- [x] make loaders dumb (loaders should expose simple functions for compiling component js, html, css and initializers)
- [x] resolve dependencies in core as apposed to in the loader

### Future Work
Vague ideas for nice-to-haves.
- [ ] integrate with static site generator (Hugo, Zola, Jekyll)
- [ ] enable multiple frameworks and versions
- [ ] internal library called belt sander for resolving dependencies efficiently
- [ ] work with windows
- [ ] switch to reason or typescript

## Benefits over server side rendering
- Portability, static files can be moved across CDN's relatively painlessly (for cost) allowing changing provider simply
- Fast, cdn's employ strategies to improve transfer rates which reduces wall time to milliseconds
- SEO, a statcally served page will provide better seo for crawlers specifically ones that cannot execute javascript

## Desired Developer Experience
1. Choose a backend (Svelte, React, Vue, Any SSRerable front end framework)
2. Add this via build tool integration (Rollup, Gulp, Webpack, Brunch)
3. build your templates and components
4. ???
5. Profit with lightning fast bare bones development!

## Making your own Loader /lo-dah/
Belte loaders are the core to making strapping on components from different libraries

requirements:
loaders require these to function as intended
- [x] A way to render components (Server Side Rendering)
- [x] A way to hydrate components inline or otherwise
- [ ] (optional) Extract styles to sheet 
- [ ] (optional) A way to reference header values 

loaders simply resolve a component to it's esm standard and insert it into a template.

| framework  | repo |
| ------------- | ------------- |
| [svelte v2](https://svelte.technology/)  | this repo |
| [react v16.8.6](https://reactjs.org/)  | this repo |

#### Testing your loader
for your loader to be accepted you'll need to use the test suite to ensure compliance with custom-elements.

## Gotchas
- When passing a number for example ```html <custom-element attr=1/>``` it will be converted to a string, we can fix this by parsing the attribute on the element. For example in svelte ```javascript 
    oncreate() {
      const { count } = this.get();
      this.set({count: parseInt(count)});
		}``` will solve the problem.  

## Author
Luke Collier ([website](https://www.lukecollier.dev) [email](mailto:contact@lukecollier.dev))
