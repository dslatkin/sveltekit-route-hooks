import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before (fruits)/banana/+page.server.js');
	const response = await resolve(event);
	console.log('After (fruits)/banana/+page.server.js');
	return response
});

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		fruitType: '🍌',
		fruitCount: 7
	};
}
