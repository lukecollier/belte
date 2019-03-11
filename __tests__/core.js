const test = require('ava');
const { compile, defaultCompile } = require('../src/core.js');

const emptyDocument = "<html><head></head><body></body></html>";

test('compiling an empty string returns empty string', t => {
  const result = defaultCompile("");
	t.is(result, emptyDocument)
});

test('compiling an empty document returns an empty document', t => {
  const result = defaultCompile(emptyDocument);
	t.is(result, emptyDocument);
});

test.only('compiling an document with a custom element gives replaces with element', 
  t => {
    const result = defaultCompile(`<html><head><title></title></head><body><custom-element name="Luke Collier" count=5 test></custom-element><logic-element></logic-element></body></html>`);

    t.snapshot(result);
  });

