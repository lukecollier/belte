# belt [/belt-ah/](https://dictionary.cambridge.org/pronunciation/english/belt)
strap your svelte components onto plain old html

## Q/A
- Q: Why?
  A: Insprired by the [JAM stack](https://jamstack.org/) I wanted to get all the benefits of a statically generated page with all the atomic, lean and interactivity of a javascript framework.
- Q: Why svelte?
  A: Svelte is a good place to start as it's easy to initialize and segregates itself into small bundles very nicely.
- Q: React soon?
  A: Not soon but with a generic enough solution we could add adapters to allow for any statically buildable javascript front end library to be used.

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
### 1.0
completing the core library
- [ ] investigate licensing
- [ ] proof of concept
- [ ] quickstart
- [ ] write guide
- [ ] sourcemaps and other dev goodies 

### Future Work
Vague ideas for nice-to-haves.
- [ ] loaders test kit
- [ ] support multiple frameworks
- [ ] integrate with static site generator (Hugo, Zola, Jekyll)
- [ ] enable multiple frameworks and versions
- [ ] enable efficient component optimisations using a dependency graph (belt sander)
- [ ] work with windows

## Benefits over server side rendering
- Portability, static files can be moved across CDN's relatively painlessly (for cost) allowing changing provider simply.
- Fast, cdn's employ strategies to improve transfer rates which reduces wall time to milliseconds

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
- [x] A way to hydrate components
- [ ] (optional) Extract styles to sheet 
- [ ] (optional) A way to reference header values 

Loaders work with 3 components,
- Head, resolves everything that goes into the head
- Inline, replaced in line where custom elements are found
- end, loaded at the end of the java file

| framework  | repo |
| ------------- | ------------- |
| [svelte v2](https://svelte.technology/)  | this repo |

#### Testing your loader
for your loader to be accepted you'll need to use the test suite to ensure compliance with custom-elements.

## Author
Luke Collier ([website](https://www.lukecollier.dev) [email](mailto:contact@lukecollier.dev))
