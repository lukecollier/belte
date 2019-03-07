const test = require('ava');
const {render, javascript, css} = require('../src/svelteLoader.js');

const resource = (filename) => `${__dirname}/resource/${filename}`;

test('test can resolve rendered element with child and data', t => {
  const result = render(resource('svelte/CustomElement.html'), {name: "John"});
	t.snapshot(result);
});

test('test can resolve rendered element that contains logic', t => {
	const constantDate = new Date();
	constantDate.setMinutes(11);
	constantDate.setHours(11);
	constantDate.setSeconds(11);
  const result = render(resource('svelte/LogicElement.html'), {time: constantDate});
	t.snapshot(result);
});

// remember to fix css rendering optimally, it'll be fun!
test.skip('test can resolve rendering css', t => {
  const result = css(resource('svelte/LogicElement.html'), {});
	t.snapshot(result);
});

test('test can resolve compiling client javascript', t => {
  const result = javascript(resource('svelte/CustomElement.html'), {});
	t.snapshot(result);
});

