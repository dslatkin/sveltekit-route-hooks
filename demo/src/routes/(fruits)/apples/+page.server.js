import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before (fruits)/apple/+page.server.js');
	const response = await resolve(event);
	console.log('After (fruits)/apple/+page.server.js');
	return response
});

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		fruitType: '🍏',
		fruitCount: 4
	};
}
