import { registerHandler } from 'sveltekit-route-hooks';

registerHandler(async ({event, resolve}) => {
	console.log('Before /launch-codes/[code]/+page.server.js');
	const response = await resolve(event);
	console.log('After /launch-codes/[code]/+page.server.js');
	return response
});
