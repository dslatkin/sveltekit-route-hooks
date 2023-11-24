import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before /launch-codes/+layout.server.js');
	const response = await resolve(event);
	console.log('After /launch-codes/+layout.server.js');
	return response
});

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
	return {
		launch_codes: [
			'zr8boh59fdr',
			'sqve5ba2j08',
			'auepdc6i627',
			'84qjupmk3q3',
			'6v2vnc7raeu',
			'ca7eghqf50b'
		]
	};
}
