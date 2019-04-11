import { client } from '../../../src/loader/sveltev2';

test('can compile a client svelte file', () => {
  const result = client('/Users/collierl/Project/Tinker/belte/tests/resource/svelte/BelteSingular.html');
  expect(result).toMatchSnapshot();
});
