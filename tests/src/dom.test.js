import { customElements, parse, replaceWith, serialize } from '../../src/dom.js';

test('an empty document returns no custom element customElements', () => {
  const parsed = parse("<!DOCTYPE html><html><head><title></title></head><body></body></html>");
  const result = customElements(parsed);
  expect(result).toEqual([]);
});

test('an document with elements returns customElements', () => {
  const parsed = parse("<!DOCTYPE html><html><head><title></title></head><body><custom-element></custom-element></body></html>");
  const result = customElements(parsed);
  expect(result).toEqual([{id: 'belte-component-0', attr: {}, name: 'custom-element'}]);
});

test('an document with elements returns customElements with attribs', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element test="hello"></custom-element></body></html>`);
  const result = customElements(parsed);
  expect(result).toEqual([{id: 'belte-component-0', attr: {test: "hello"}, name: 'custom-element'}]);
});

test('an document with elements returns customElements with multiple elements', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element></custom-element><custom-element-two></custom-element-two></body></html>`);
  const result = customElements(parsed);
  expect(result).toEqual([{id: 'belte-component-0', attr: {}, name: 'custom-element'}, {id: 'belte-component-1', attr: {}, name: 'custom-element-two'}]);
});

test('an document with elements returns customElements with multiple elements and attribs', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element number="one"></custom-element><custom-element-two number="two"></custom-element-two></body></html>`);
  const result = customElements(parsed);
  expect(result).toEqual([{id: 'belte-component-0', attr: {number: "one"}, name: 'custom-element'}, {id: 'belte-component-1', attr: {number: "two"}, name: 'custom-element-two'}]);
});

test('can replace custom element', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element></custom-element></body></html>`);
  const result = replaceWith(parsed, (name, _) => name, (name) => name + '-resolved');
  expect(serialize(result)).toMatchSnapshot();
});

test('can replace custom multiple elements', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element></custom-element><custom-element-two></custom-element-two></body></html>`);
  const result = replaceWith(parsed, (name, _) => name, (name) => name + '-resolved');
  expect(serialize(result)).toMatchSnapshot();
});

test('can replace custom element with attributes', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element name="jeff"></custom-element></body></html>`);
  const result = replaceWith(parsed, (name, attr) => name + '-with-' + JSON.stringify(attr), (name) => name + '-resolved');
  expect(serialize(result)).toMatchSnapshot();
});

test('can replace custom element with multiple attributes', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element name="jeff" second="mcgee"></custom-element></body></html>`);
  const result = replaceWith(parsed, (name, attr) => name + '-with-' + JSON.stringify(attr), (name) => name + '-resolved');
  expect(serialize(result)).toMatchSnapshot();
});

test('can replace custom element with multiple html attributes', () => {
  const parsed = parse(`<!DOCTYPE html><html><head><title></title></head><body><custom-element name="jeff" second="mcgee" class="nonsense"></custom-element></body></html>`);
  const result = replaceWith(parsed, (name, attr) => name + '-with-' + JSON.stringify(attr), (name) => name + '-resolved');
  expect(serialize(result)).toMatchSnapshot();
});
