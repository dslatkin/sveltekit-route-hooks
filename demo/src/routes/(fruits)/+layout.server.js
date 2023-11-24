import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before /(fruits)/+layout.server.js');
	const response = await resolve(event);
	console.log('After /(fruits)/+layout.server.js');
	return response
});
