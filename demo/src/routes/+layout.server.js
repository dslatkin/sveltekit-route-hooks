import { handleRoute } from 'sveltekit-route-hooks';

let requestCount = 0;

handleRoute(async function ({ event, resolve }) {
    console.log(`🌎 Request #${++requestCount}: ${event.route.id}`);

    console.log('Before /+layout.server.js');
    const response = await resolve(event);
    console.log('After /+layout.server.js');
    return response;
});
