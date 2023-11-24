import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before outer page guard');
	const response = await resolve(event);
	console.log('After outer page guard');
	return response
});

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		launch_codes: Array.from({ length: 6 }, () => Math.random().toString(36).slice(2))
	};
}
