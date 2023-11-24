import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before /+layout.server.js');
	const response = await resolve(event);
	console.log('After /+layout.server.js');
	return response
});
