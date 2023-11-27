import { handleRoute } from 'sveltekit-route-hooks';

handleRoute(async ({ event, resolve }) => {
    console.log('Before /(fruits)/+layout.server.js');
    const response = await resolve(event);
    console.log('After /(fruits)/+layout.server.js');
    return response;
});
