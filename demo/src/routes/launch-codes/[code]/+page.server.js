import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before /launch-codes/[code]/+page.server.js');
	const response = await resolve(event);
	console.log('After /launch-codes/[code]/+page.server.js');
	return response
});

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		launch_codes: Array.from({ length: 6 }, () => Math.random().toString(36).slice(2))
	};
}
