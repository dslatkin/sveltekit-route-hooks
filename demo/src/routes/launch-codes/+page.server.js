import { error } from '@sveltejs/kit';
import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before route guard');
	if (Math.random() < 0.25) {
		throw error(403, { message: 'You are not authorized' });
	}
	const response = await resolve(event);
	console.log('After route guard');
	return response
});

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		launch_codes: Array.from({ length: 6 }, () => Math.random().toString(36).slice(2))
	};
}
