// import { registerHandler } from 'sveltekit-route-hooks';

// registerHandler(async ({event, resolve}) => {
// 	console.log('Before /client-only/+page.js');
// 	const response = await resolve(event);
// 	console.log('After /client-only/+page.js');
// 	return response
// });

/** @type {import('./$types').PageLoad} */
export function load() {
	return {
		author: 'dslatkin'
	};
}
