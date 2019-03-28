const test = require('ava');
import pathUtil from 'path';

const { compile, allLoaders, htmlResolversFromLoaders } = require('../src/core.js');

const emptyDocument = "<html><head></head><body></body></html>";

const opts = {
  components: ['__tests__/resource/svelte/CustomElement.html',
  '__tests__/resource/svelte/LogicElement.html',
  '__tests__/resource/svelte/PlainElement.html',
  ],
  salt: 'default-salt'
};

test('can a default compile occur with minimal options', t => {
  const result = compile(`<html><head><title></title></head><body><custom-element name="Luke Collier" count=5 test></custom-element><custom-element name="Luke Collier" count=6 test/></custom-element><logic-element></logic-element></body></html>`, opts);

  t.snapshot(result.html);
});

const fakeLoader = (src, encode) => {
  return {
    render: (attr) => {return {src, attr}},
    client: (attr) => {return {src, attr}},
    styles: () => {src, attr},
    constructor: (id, attr) => {return {id: id, attr: attr}},
    dependencies: () => [],
    otherDependencies: () => []
  }
}

test('get html resolvers from loaders', t => {
  const loaders = allLoaders(['__tests__/resource/svelte/CustomElement.html'], fakeLoader, (name) => name);

  const result = htmlResolversFromLoaders(loaders);
  t.is(result.CustomElement({}).src, 
    __dirname + '/resource/svelte/CustomElement.html');
});

test('can get all svelte loaders', t => {
  const result = allLoaders(['__tests__/resource/svelte/CustomElement.html'], fakeLoader, (name) => name);
	t.is(result.get('CustomElement').client({}).src, __dirname + '/resource/svelte/CustomElement.html');
});
