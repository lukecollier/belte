const test = require('ava');
const {renderComponent, compileClient, css} = require('../src/svelteLoader.js');

const resource = (filename) => `${__dirname}/resource/${filename}`;

test.skip('test can resolve rendered element that contains logic', t => {
	const constantDate = new Date();
	constantDate.setMinutes(11);
	constantDate.setHours(11);
	constantDate.setSeconds(11);
  const result = renderComponent(resource('svelte/LogicElement.html'), {time: constantDate});
	t.snapshot(result);
});

test('test can resolve compiling client javascript', t => {
  const result = compileClient(resource('svelte/CustomElement.html'), {});
	t.snapshot(result);
});
