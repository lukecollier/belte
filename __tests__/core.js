const test = require('ava');

const { compile } = require('../src/core.js');

const emptyDocument = "<html><head></head><body></body></html>";

test('compiling an empty string returns empty string', t => {
  const result = compile("").html;
	t.is(result, emptyDocument)
});

test('compiling an empty document returns an empty document', t => {
  const result = compile(emptyDocument).html;
	t.is(result, emptyDocument);
});

test('compiling an document with a custom element gives replaces with element', 
  t => {
    const result = compile(`<html><head><title></title></head><body><custom-element name="Luke Collier" count=5 test></custom-element><custom-element name="Luke Collier" count=6 test/></custom-element><logic-element></logic-element></body></html>`).html;

    t.snapshot(result);
  });

