const test = require('ava');
const { hyphenCaseToTitleCase } = require('../src/helper.js');

test('conver hyphen case to title case', t => {
  const result = hyphenCaseToTitleCase('test-case');
	t.is(result, 'TestCase');
});

