const test = require('ava');
const { 
  hyphenCaseToTitleCase, 
  stripExtension,
  filenameFromPath,
  nameFromPath } = require('../src/string.js');

test('convert hyphen case to title case', t => {
  const result = hyphenCaseToTitleCase('test-case');
	t.is(result, 'TestCase');
});

test('convert hyphen case to title case with one word', t => {
  const result = hyphenCaseToTitleCase('test');
	t.is(result, 'Test');
});

test('convert hyphen case to title case with random case', t => {
  const result = hyphenCaseToTitleCase('tEst-mE');
	t.is(result, 'TestMe');
});

test('strip extension removes an extension', t => {
  const result = stripExtension('strip-test.txt');
	t.is(result, 'strip-test');
});

test('(osx) can get the filename from a path', t => {
  const result = filenameFromPath('path/to/test/strip-test.txt');
	t.is(result, 'strip-test.txt');
});

test('(osx) name can be retrieced from a full path', t => {
  const result = nameFromPath('~/path/to/test/strip-test.txt');
	t.is(result, 'strip-test');
});
