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
  <script src="output.js">
</head>
...
<div id="belte-greeting-0000"></div> <!-- populate with the ssr default fields -->
```
```javascript
var beltegreeting0000 = 
  new Greeting({
    target: document.getElementById("belte-greeting-0000"),
    data: { name: "luke", slot: "Hello, " }
    }
```

output.js contains example of svelte compiled greeting

## Quickstart

## Guide

## Roadmap
- [ ] proof of concept
- [ ] core
- [ ] quickstart
- [ ] write guide
