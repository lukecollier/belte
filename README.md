# belte [/belt/](https://dictionary.cambridge.org/pronunciation/english/belt)
strap your svelte components onto plain old html

## Is this for me?
Svelte is great at creating atomic components, but wouldn't it be cool to automatically go through a document and populate all your components on?

The answer is yes!

## Example

html'''
<greeting name="luke">
  Hello, 
</greeting>
'''

&darr; &darr; &darr;

html'''
<div id="belte-greeting-0000"></div>
'''
'''javscript
var beltegreeting0000 = 
  new Greeting({
    target: document.getElementById("belte-greeting-0000"),
    data: { name: "yo", slot: "Hello, " }
    }
'''

## Quickstart

## Guide

## Roadmap
- [ ] proof of concept
- [ ] core
- [ ] quickstart
- [ ] write guide
