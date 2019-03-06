# belte [/belt/](https://dictionary.cambridge.org/pronunciation/english/belt)
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
- [ ] proof of concept
- [ ] core
- [ ] quickstart
- [ ] write guide

## Benefits over server side rendering
- Portability, static files can be moved across CDN's relatively painlessly (for cost) allowing changing provider simply.
- Fast, cdn's employ strategies to improve transfer rates which reduces wall time to milliseconds

## Desired Developer Experience
1. Choose a backend (Svelte, React, Vue, Any SSRerable front end framework)
2. Add this via build tool integration (Rollup, Gulp, Webpack, Brunch)
3. build your templates and components
4. ???
5. Profit with lightning fast bare bones development!

## Author
Luke Collier [Website](https://www.lukecollier.dev) [Email](mailto:contact@lukecollier.dev)
