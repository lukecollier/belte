import { hypenCaseFromPath, stripExtension } from '../../src/string.js';

test("doesn't stip when no extension", () => {
  expect(stripExtension('HelloWorld')).toBe('HelloWorld');
});

test("strips extension from filename", () => {
  expect(stripExtension('HelloWorld.js')).toBe('HelloWorld');
});

test("strips only one extension from filename", () => {
  expect(stripExtension('HelloWorld.template.js')).toBe('HelloWorld.template');
});

test('an camel case word returns a hypen cased name', () => {
  expect(hypenCaseFromPath('HelloWorld')).toBe('hello-world');
});
